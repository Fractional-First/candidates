
import {
  Brain, Crown, Users, Handshake, Lightbulb, Target, Zap, Shield,
  Heart, Compass, Rocket, Star, Award, Eye, Megaphone, Puzzle,
  Globe, Clock, TrendingUp, CheckCircle, Wrench, Palette, Book,
  Music, Mountain, Coffee, Smile, Diamond, Flame, Gem
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

// Predefined stock of 30 unique icons mapped to keywords/themes
export const ICON_KEYWORD_MAP: Record<string, LucideIcon> = {
  // Leadership & Management
  "leadership": Crown,
  "leader": Crown,
  "management": Users,
  "manager": Users,
  "strategy": Compass,
  "strategist": Compass,
  "vision": Eye,
  "visionary": Eye,
  "execution": Target,
  "executor": Target,

  // Collaboration & Communication
  "collaboration": Handshake,
  "collaborative": Handshake,
  "communication": Megaphone,
  "communicator": Megaphone,
  "teamwork": Users,
  "team": Handshake,
  "catalyst": Handshake,
  "networking": Globe,
  "relationship": Heart,

  // Innovation & Creativity
  "innovation": Lightbulb,
  "innovative": Lightbulb,
  "creativity": Lightbulb,
  "creative": Lightbulb,
  "design": Palette,
  "designer": Palette,
  "thinking": Brain,
  "thinker": Brain,
  "ideation": Lightbulb,

  // Problem Solving & Analysis
  "problem": Puzzle,
  "solving": Wrench,
  "solver": Wrench,
  "analysis": Brain,
  "analyst": Brain,
  "analytical": Brain,
  "critical": Eye,
  "research": Book,
  "researcher": Book,

  // Performance & Results
  "performance": TrendingUp,
  "results": Award,
  "achievement": CheckCircle,
  "achiever": Award,
  "excellence": Diamond,
  "quality": Star,

  // Energy & Drive
  "energy": Zap,
  "energetic": Zap,
  "passion": Flame,
  "passionate": Flame,
  "drive": Rocket,
  "driven": Rocket,
  "motivation": Mountain,
  "motivator": Mountain,
  "enthusiasm": Smile,
  "enthusiastic": Smile,

  // Skills & Expertise
  "technical": Wrench,
  "expertise": Gem,
  "expert": Gem,
  "knowledge": Book,
  "learning": Book,
  "adaptability": Clock,
  "adaptable": Clock,

  // Support & Service
  "support": Shield,
  "supportive": Shield,
  "service": Heart,
  "mentoring": Users,
  "mentor": Users,
  "coaching": Compass,
  "coach": Compass,
  "empathy": Heart,
  "empathetic": Heart,
  "listener": Heart,

  // Special traits
  "resilience": Mountain,
  "resilient": Mountain,
  "focus": Target,
  "focused": Target,
  "balance": Coffee,
  "harmony": Music,
  "growth": TrendingUp,
  "bold": Flame,
  "confident": Crown,
  "confidence": Crown
}

// Enhanced semantic similarity mapping for better matching
const SEMANTIC_GROUPS: Record<string, string[]> = {
  "leadership": ["lead", "manage", "direct", "guide", "captain", "head", "boss", "chief", "executive"],
  "collaboration": ["partner", "cooperate", "work", "together", "unite", "collective", "joint"],
  "innovation": ["create", "invent", "new", "original", "fresh", "novel", "breakthrough", "pioneer"],
  "problem": ["solve", "fix", "resolve", "troubleshoot", "debug", "repair", "solution"],
  "communication": ["speak", "present", "explain", "articulate", "express", "convey", "talk", "voice"],
  "analysis": ["analyze", "examine", "study", "investigate", "evaluate", "assess", "review"],
  "performance": ["achieve", "deliver", "execute", "accomplish", "succeed", "excel", "perform"],
  "creativity": ["artistic", "imaginative", "inventive", "inspired", "original", "innovative"],
  "technical": ["tech", "engineering", "coding", "development", "systems", "digital"],
  "energy": ["dynamic", "vibrant", "active", "powerful", "strong", "intense", "vigorous"],
  "resilience": ["tough", "strong", "endure", "persist", "overcome", "bounce", "recover"],
  "empathy": ["caring", "understanding", "compassionate", "kind", "sensitive", "thoughtful"],
  "focus": ["concentrated", "dedicated", "committed", "determined", "precise", "targeted"],
  "vision": ["see", "foresight", "insight", "perspective", "outlook", "future-oriented"]
}

export function getSuperpowerIcons(superpowers: Array<{ title: string; description: string }>): Array<{ title: string; description: string; icon: LucideIcon }> {
  const usedIcons = new Set<LucideIcon>()
  const results: Array<{ title: string; description: string; icon: LucideIcon }> = []

  for (const superpower of superpowers) {
    const icon = selectBestIcon(superpower.title, superpower.description, usedIcons)
    usedIcons.add(icon)
    results.push({
      ...superpower,
      icon
    })
  }

  return results
}

function selectBestIcon(title: string, description: string, usedIcons: Set<LucideIcon>): LucideIcon {
  const text = `${title} ${description}`.toLowerCase()
  const titleWords = title.toLowerCase().split(/\s+/)
  
  // Step 1: Try exact keyword matches in title first (prioritize title over description)
  for (const word of titleWords) {
    if (ICON_KEYWORD_MAP[word] && !usedIcons.has(ICON_KEYWORD_MAP[word])) {
      return ICON_KEYWORD_MAP[word]
    }
  }

  // Step 2: Try exact keyword matches in full text
  for (const [keyword, icon] of Object.entries(ICON_KEYWORD_MAP)) {
    if (!usedIcons.has(icon) && text.includes(keyword)) {
      return icon
    }
  }

  // Step 3: Try semantic similarity matches with title priority
  for (const word of titleWords) {
    for (const [primaryKeyword, variants] of Object.entries(SEMANTIC_GROUPS)) {
      const primaryIcon = ICON_KEYWORD_MAP[primaryKeyword]
      if (!primaryIcon || usedIcons.has(primaryIcon)) continue

      for (const variant of variants) {
        if (word.includes(variant) || variant.includes(word)) {
          return primaryIcon
        }
      }
    }
  }

  // Step 4: Try semantic similarity matches in full text
  for (const [primaryKeyword, variants] of Object.entries(SEMANTIC_GROUPS)) {
    const primaryIcon = ICON_KEYWORD_MAP[primaryKeyword]
    if (!primaryIcon || usedIcons.has(primaryIcon)) continue

    for (const variant of variants) {
      if (text.includes(variant)) {
        return primaryIcon
      }
    }
  }

  // Step 5: Try partial matches on main keywords with word boundaries
  for (const [keyword, icon] of Object.entries(ICON_KEYWORD_MAP)) {
    if (!usedIcons.has(icon)) {
      const words = text.split(/\s+/)
      for (const word of words) {
        // Check for partial matches but ensure meaningful overlap
        if (word.length >= 4 && keyword.length >= 4) {
          if (word.includes(keyword) || keyword.includes(word)) {
            return icon
          }
        }
      }
    }
  }

  // Step 6: Find any unused icon from our stock, prioritizing more meaningful ones
  const priorityIcons = [
    Crown, Lightbulb, Target, Heart, Handshake, Brain, 
    Mountain, Rocket, Shield, Award, Compass, Gem
  ]
  
  for (const icon of priorityIcons) {
    if (!usedIcons.has(icon)) {
      return icon
    }
  }

  // Step 7: Find any remaining unused icon
  for (const icon of Object.values(ICON_KEYWORD_MAP)) {
    if (!usedIcons.has(icon)) {
      return icon
    }
  }

  // Step 8: Fallback to Star icon (should rarely happen with 30 icons and max 3 superpowers)
  return Star
}
