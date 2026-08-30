import { Router } from 'express';
import { db } from '../data/db';
import { gapAnalysisService } from '../services/gapAnalysisService';

const router = Router();

router.get('/learning-path', (req, res) => {
  const userId = (req.query.userId as string) || 'u-1';
  const user = db.getUserById(userId);
  const gapReport = gapAnalysisService.analyzeUserGaps(userId);

  const allCourses = db.getAllCourses();
  const getCourseUrl = (title: string, skill: string) => {
    const found = allCourses.find(c =>
      c.title.toLowerCase().includes(title.toLowerCase()) ||
      title.toLowerCase().includes(c.title.toLowerCase()) ||
      c.skill.toLowerCase() === skill.toLowerCase()
    );
    if (found?.externalUrl) return found.externalUrl;
    if (skill.toLowerCase().includes('python')) return 'https://www.kaggle.com/learn/python';
    if (skill.toLowerCase().includes('ai') || skill.toLowerCase().includes('machine learning')) return 'https://developers.google.com/machine-learning/crash-course';
    if (skill.toLowerCase().includes('cloud')) return 'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/';
    if (skill.toLowerCase().includes('gis')) return 'https://www.coursera.org/learn/gis';
    if (skill.toLowerCase().includes('sql')) return 'https://www.kaggle.com/learn/intro-to-sql';
    if (skill.toLowerCase().includes('visualization')) return 'https://learn.microsoft.com/en-us/training/paths/create-use-analytics-reports-power-bi/';
    if (skill.toLowerCase().includes('privacy')) return 'https://www.meity.gov.in/content/digital-personal-data-protection-act-2023';
    return 'https://unstats.un.org/unsd/nationalaccount/sna.asp';
  };

  const learningPath = {
    title: 'Personalized AI Statistical Competency Pathway',
    targetRole: user?.designation || 'Statistical Officer',
    phases: [
      {
        phaseNumber: 1,
        name: 'Phase 1 — Foundation',
        theme: 'Core Tooling & Modern Programming',
        status: 'in_progress',
        estimatedWeeks: '2-3 Weeks',
        courses: [
          {
            title: 'Python for Statistical Data Analysis',
            skill: 'Python',
            provider: 'iGOT Karmayogi',
            duration: '8 hours',
            difficulty: 'Intermediate',
            status: 'in_progress',
            progress: 45,
            actionUrl: '/courses',
            externalUrl: getCourseUrl('Python for Statistical Data Analysis', 'Python')
          },
          {
            title: 'Modern Data Visualization with PowerBI for Public Policy',
            skill: 'Data Visualization',
            provider: 'iGOT Karmayogi',
            duration: '7 hours',
            difficulty: 'Intermediate',
            status: 'completed',
            progress: 100,
            actionUrl: '/courses',
            externalUrl: getCourseUrl('Modern Data Visualization with PowerBI for Public Policy', 'Data Visualization')
          }
        ]
      },
      {
        phaseNumber: 2,
        name: 'Phase 2 — Applied Skills',
        theme: 'Geospatial Surveys & Cloud Storage',
        status: 'in_progress',
        estimatedWeeks: '3-4 Weeks',
        courses: [
          {
            title: 'Spatial Analytics & GIS in Government Surveys',
            skill: 'GIS',
            provider: 'iGOT Karmayogi',
            duration: '10 hours',
            difficulty: 'Beginner',
            status: 'in_progress',
            progress: 20,
            actionUrl: '/courses',
            externalUrl: getCourseUrl('Spatial Analytics & GIS in Government Surveys', 'GIS')
          },
          {
            title: 'Government Cloud Infrastructure for Statisticians',
            skill: 'Cloud Computing',
            provider: 'iGOT Karmayogi',
            duration: '6 hours',
            difficulty: 'Beginner',
            status: 'not_started',
            progress: 0,
            actionUrl: '/courses',
            externalUrl: getCourseUrl('Government Cloud Infrastructure for Statisticians', 'Cloud Computing')
          }
        ]
      },
      {
        phaseNumber: 3,
        name: 'Phase 3 — Advanced',
        theme: 'Machine Learning & High-Impact Methodologies',
        status: 'locked',
        estimatedWeeks: '4-5 Weeks',
        courses: [
          {
            title: 'AI & Machine Learning for Official Statistics',
            skill: 'AI/ML',
            provider: 'iGOT Karmayogi',
            duration: '12 hours',
            difficulty: 'Intermediate',
            status: 'not_started',
            progress: 0,
            actionUrl: '/courses',
            externalUrl: getCourseUrl('AI & Machine Learning for Official Statistics', 'AI/ML')
          },
          {
            title: 'Data Privacy & DPDP Act 2023 Compliance',
            skill: 'Data Privacy',
            provider: 'iGOT Karmayogi',
            duration: '5 hours',
            difficulty: 'Intermediate',
            status: 'not_started',
            progress: 0,
            actionUrl: '/courses',
            externalUrl: getCourseUrl('Data Privacy & The Digital Personal Data Protection Act 2023', 'Data Privacy')
          }
        ]
      },
      {
        phaseNumber: 4,
        name: 'Phase 4 — Domain Application',
        theme: 'Cadre Leadership & Policy Translation',
        status: 'locked',
        estimatedWeeks: '2 Weeks',
        courses: [
          {
            title: 'Executive Masterclass: AI & Big Data in Official Statistics',
            skill: 'AI/ML & Governance',
            provider: 'NSSTA TPAC (Residential)',
            duration: '5 Days',
            difficulty: 'Advanced',
            status: 'not_started',
            progress: 0,
            actionUrl: '/nssta',
            externalUrl: 'https://developers.google.com/machine-learning/crash-course'
          }
        ]
      }
    ]
  };

  res.json({ learningPath, gapReport });
});

export default router;
