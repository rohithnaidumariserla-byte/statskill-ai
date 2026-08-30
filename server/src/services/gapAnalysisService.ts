import { db } from '../data/db';

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  category: string;
  currentScore: number;
  requiredScore: number;
  gap: number;
  severity: 'High' | 'Medium' | 'Low' | 'Mastered';
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  requiredLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface GapAnalysisReport {
  overallCompetency: number;
  roleTitle: string;
  cadre: string;
  gaps: SkillGapItem[];
  highGapCount: number;
  mediumGapCount: number;
  lowGapCount: number;
  masteredCount: number;
  aiExplanation: string;
}

export class GapAnalysisService {
  analyzeUserGaps(userId: string): GapAnalysisReport | null {
    const user = db.getUserById(userId);
    if (!user) return null;

    const userSkills = db.getUserSkills(userId);
    const benchmark = db.getRoleBenchmark(user.designation) || db.getAllRoleBenchmarks()[0];

    let totalScore = 0;
    userSkills.forEach(s => totalScore += s.competencyScore);
    const overallCompetency = userSkills.length > 0 ? Math.round(totalScore / userSkills.length) : 70;

    const gaps: SkillGapItem[] = benchmark.requiredSkills.map(req => {
      const userSkill = userSkills.find(s => s.skillName.toLowerCase() === req.skillName.toLowerCase());
      const currentScore = userSkill ? userSkill.competencyScore : 25;
      const currentLevel = userSkill ? userSkill.competencyLevel : 'Beginner';
      const gap = Math.max(0, req.requiredScore - currentScore);

      let severity: 'High' | 'Medium' | 'Low' | 'Mastered' = 'Low';
      if (gap >= 25) severity = 'High';
      else if (gap >= 10) severity = 'Medium';
      else if (gap > 0) severity = 'Low';
      else severity = 'Mastered';

      const skillObj = db.getAllSkills().find(s => s.name.toLowerCase() === req.skillName.toLowerCase());

      return {
        skillId: req.skillId,
        skillName: req.skillName,
        category: skillObj ? skillObj.category : 'Technical',
        currentScore,
        requiredScore: req.requiredScore,
        gap,
        severity,
        currentLevel,
        requiredLevel: req.level
      };
    });

    gaps.sort((a, b) => b.gap - a.gap);

    const highGapCount = gaps.filter(g => g.severity === 'High').length;
    const mediumGapCount = gaps.filter(g => g.severity === 'Medium').length;
    const lowGapCount = gaps.filter(g => g.severity === 'Low').length;
    const masteredCount = gaps.filter(g => g.severity === 'Mastered').length;

    const topGaps = gaps.filter(g => g.severity === 'High').map(g => g.skillName).slice(0, 3).join(', ');

    const aiExplanation = `Based on your profile as ${user.designation}, your largest competency gaps are in ${topGaps || 'Technical Modernization'}. While your traditional statistical methodology and survey design remain exemplary (${overallCompetency}% overall index), closing these digital and AI gaps will directly empower automated CAPI data processing and modern data dissemination in official statistical registries.`;

    return {
      overallCompetency,
      roleTitle: benchmark.roleName,
      cadre: benchmark.cadre,
      gaps,
      highGapCount,
      mediumGapCount,
      lowGapCount,
      masteredCount,
      aiExplanation
    };
  }
}

export const gapAnalysisService = new GapAnalysisService();
