import { MetadataRoute } from 'next';
import { mockMockTests, mockMaterials, mockBlogs, mockCurrentAffairs, mockPlans } from '@/data/mockData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.aspirav.co.in';

  // 1. Static Routes
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/materials`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/mock-tests`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/community`, lastModified: new Date(), changeFrequency: 'always' as const, priority: 0.7 },
    { url: `${baseUrl}/guidance`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/current-affairs`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  // 2. Dynamic Mock Tests
  const mockTestRoutes = mockMockTests
    .filter((t) => t.status !== 'draft')
    .map((test) => ({
      url: `${baseUrl}/mock-tests/${test.slug || test.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  // 3. Dynamic Study Materials
  const materialRoutes = mockMaterials
    .filter((m) => m.status !== 'draft')
    .map((mat) => ({
      url: `${baseUrl}/materials/${mat.slug || mat.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  // 4. Dynamic Guidance Blogs
  const blogRoutes = mockBlogs
    .map((blog) => ({
      url: `${baseUrl}/guidance/${blog.slug || blog.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  // 5. Dynamic Current Affairs
  const currentAffairsRoutes = mockCurrentAffairs
    .map((item) => ({
      url: `${baseUrl}/current-affairs/${item.slug || item.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

  // 6. Dynamic Study Plans
  const planRoutes = mockPlans
    .map((plan) => {
      const examSlug = plan.examId.toLowerCase().includes('upsc') ? 'upsc' :
                       plan.examId.toLowerCase().includes('ssc') ? 'ssc' :
                       plan.examId.toLowerCase().includes('rail') ? 'railways' : 'banking';
      return {
        url: `${baseUrl}/study-planner/${examSlug}/${plan.slug || plan.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });

  return [
    ...staticRoutes,
    ...mockTestRoutes,
    ...materialRoutes,
    ...blogRoutes,
    ...currentAffairsRoutes,
    ...planRoutes,
  ];
}
