import { Course, NSSTAProgramme, User, UserSkill, RoleBenchmark } from '../data/seedData';
import { db } from '../data/db';

export interface CourseRecommendation {
  course: Course;
  matchScore: number;
  currentScore: number;
  requiredScore: number;
  gap: number;
  priorityLevel: 'HIGH PRIORITY' | 'MEDIUM PRIORITY' | 'LOW PRIORITY';
  whyReason: string;
  breakdown: {
    skillGapWeight: number;       // 35%
    roleRelevanceWeight: number;   // 25%
    previousLearningWeight: number;// 15%
    careerRequirementWeight: number;// 10%
    deptPriorityWeight: number;    // 10%
    emergingDemandWeight: number;  // 5%
  };
  reason: string;
  isEnrolled: boolean;
  progress?: number;
}

export class RecommendationEngine {
  calculateCourseRecommendation(
    course: Course,
    user: User,
    userSkills: UserSkill[],
    roleBenchmark: RoleBenchmark
  ): CourseRecommendation {
    const userSkill = userSkills.find(s => s.skillName.toLowerCase() === course.skill.toLowerCase());
    const benchmarkSkill = roleBenchmark.requiredSkills.find(s => s.skillName.toLowerCase() === course.skill.toLowerCase());

    const currentScore = userSkill ? userSkill.competencyScore : 30;
    const requiredScore = benchmarkSkill ? benchmarkSkill.requiredScore : 75;

    const gap = Math.max(0, requiredScore - currentScore);
    const gapScore = Math.min(100, (gap / 50) * 100);
    const skillGapWeight = Math.round(gapScore * 0.35);

    const roleRelevance = benchmarkSkill ? 95 : 60;
    const roleRelevanceWeight = Math.round(roleRelevance * 0.25);

    let prevLearningScore = 75;
    if (course.difficulty === 'Beginner' && currentScore < 50) prevLearningScore = 95;
    if (course.difficulty === 'Intermediate' && currentScore >= 40 && currentScore <= 75) prevLearningScore = 90;
    if (course.difficulty === 'Advanced' && currentScore >= 70) prevLearningScore = 95;
    const previousLearningWeight = Math.round(prevLearningScore * 0.15);

    const careerRequirementScore = user.experienceYears < 5 ? 90 : 80;
    const careerRequirementWeight = Math.round(careerRequirementScore * 0.10);

    const deptPriorityScore = (course.skillCategory === 'Technical' || course.skillCategory === 'Statistical') ? 95 : 80;
    const deptPriorityWeight = Math.round(deptPriorityScore * 0.10);

    const emergingSkills = ['AI/ML', 'Cloud Computing', 'Data Privacy', 'GIS'];
    const emergingDemandScore = emergingSkills.includes(course.skill) ? 100 : 70;
    const emergingDemandWeight = Math.round(emergingDemandScore * 0.05);

    const totalMatchScore = Math.min(99, skillGapWeight + roleRelevanceWeight + previousLearningWeight + careerRequirementWeight + deptPriorityWeight + emergingDemandWeight);

    const priorityLevel: 'HIGH PRIORITY' | 'MEDIUM PRIORITY' | 'LOW PRIORITY' =
      gap >= 25 ? 'HIGH PRIORITY' : gap >= 10 ? 'MEDIUM PRIORITY' : 'LOW PRIORITY';

    const whyReason = gap > 0
      ? `Your ${course.skill} competency is ${gap} percentage points below the required benchmark (${requiredScore}%) for your role as ${user.designation}.`
      : `Your ${course.skill} competency meets the benchmark (${currentScore}% / ${requiredScore}%). This module is recommended for advanced mastery.`;

    let reason = '';
    if (gap > 25) {
      reason = `High-Priority Cadre Deficit: ${currentScore}% current vs ${requiredScore}% required (${gap}% gap). Fulfills core modernization benchmark.`;
    } else if (emergingSkills.includes(course.skill)) {
      reason = `Emerging Digital-Statistics Priority under MoSPI national data modernization directives.`;
    } else {
      reason = `Recommended to advance your ${course.skill} competency to the senior cadre benchmark.`;
    }

    const enrollments = db.getUserEnrollments(user.id);
    const enrollment = enrollments.find(e => e.courseId === course.id);

    return {
      course,
      matchScore: totalMatchScore,
      currentScore,
      requiredScore,
      gap,
      priorityLevel,
      whyReason,
      breakdown: {
        skillGapWeight,
        roleRelevanceWeight,
        previousLearningWeight,
        careerRequirementWeight,
        deptPriorityWeight,
        emergingDemandWeight
      },
      reason,
      isEnrolled: !!enrollment,
      progress: enrollment ? enrollment.progress : 0
    };
  }

  getRecommendationsForUser(userId: string): CourseRecommendation[] {
    const user = db.getUserById(userId);
    if (!user) return [];

    const userSkills = db.getUserSkills(userId);
    const benchmark = db.getRoleBenchmark(user.designation) || db.getAllRoleBenchmarks()[0];
    const courses = db.getAllCourses();

    return courses
      .map(course => this.calculateCourseRecommendation(course, user, userSkills, benchmark))
      .sort((a, b) => b.matchScore - a.matchScore);
  }
}

export const recommendationEngine = new RecommendationEngine();
