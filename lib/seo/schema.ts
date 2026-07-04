interface BreadcrumbItem {
  name: string;
  item: string;
}

interface QuizQuestion {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
}

export function buildSchema(type: 'Organization' | 'BreadcrumbList' | 'BlogPosting' | 'Quiz', data: any) {
  switch (type) {
    case 'Organization':
      return {
        "@context": "https://schema.org",
        "@type": "EducationOrganization",
        "name": "Aspirav",
        "url": "https://www.aspirav.co.in",
        "logo": "https://www.aspirav.co.in/logo.png",
        "sameAs": [
          "https://twitter.com/aspirav",
          "https://github.com/Arulraj2001/Aspirun"
        ]
      };

    case 'BreadcrumbList':
      const items: BreadcrumbItem[] = data.items || [];
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": item.name,
          "item": `https://www.aspirav.co.in${item.item.startsWith('/') ? item.item : `/${item.item}`}`
        }))
      };

    case 'BlogPosting':
      const pathUrl = data.path || '';
      return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://www.aspirav.co.in${pathUrl.startsWith('/') ? pathUrl : `/${pathUrl}`}`
        },
        "headline": data.title,
        "description": data.description,
        "datePublished": data.datePublished || new Date().toISOString(),
        "author": {
          "@type": "Person",
          "name": data.authorName || "Aspirav Academic Team"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Aspirav",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.aspirav.co.in/logo.png"
          }
        }
      };

    case 'Quiz':
      const questions: QuizQuestion[] = data.questions || [];
      return {
        "@context": "https://schema.org",
        "@type": "Quiz",
        "name": data.title,
        "description": data.description,
        "educationalLevel": "Competitive Examination Prep",
        "assesses": data.subject || "General Knowledge",
        "hasPart": questions.map((q, idx) => {
          const acceptedOption = q.correctOption ? q.correctOption.toUpperCase() : 'A';
          let acceptedAnswerText = q.optionA;
          if (acceptedOption === 'B') acceptedAnswerText = q.optionB;
          else if (acceptedOption === 'C') acceptedAnswerText = q.optionC;
          else if (acceptedOption === 'D') acceptedAnswerText = q.optionD;

          return {
            "@type": "Question",
            "name": `Question ${idx + 1}`,
            "text": q.questionText,
            "suggestedAnswer": [
              { "@type": "Answer", "text": q.optionA, "position": 1 },
              { "@type": "Answer", "text": q.optionB, "position": 2 },
              { "@type": "Answer", "text": q.optionC, "position": 3 },
              { "@type": "Answer", "text": q.optionD, "position": 4 }
            ],
            "acceptedAnswer": {
              "@type": "Answer",
              "text": acceptedAnswerText
            }
          };
        })
      };

    default:
      return null;
  }
}
