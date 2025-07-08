// Service for generating conversation titles using the external API
export class TitleService {
  private static instance: TitleService;
  
  private constructor() {}
  
  static getInstance(): TitleService {
    if (!TitleService.instance) {
      TitleService.instance = new TitleService();
    }
    return TitleService.instance;
  }

  async generateTitle(text: string): Promise<string> {
    try {
      const response = await fetch('https://waitlist-api-534113739138.europe-west1.run.app/generate-title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        console.error('Failed to generate title:', response.statusText);
        // Return a fallback title if the API fails
        return `Trip Planning - ${new Date().toLocaleDateString()}`;
      }

      const result = await response.json();
      return result.title || result.generated_title || `Trip Planning - ${new Date().toLocaleDateString()}`;
    } catch (error) {
      console.error('Error generating title:', error);
      // Return a fallback title if there's an error
      return `Trip Planning - ${new Date().toLocaleDateString()}`;
    }
  }
}

export const titleService = TitleService.getInstance(); 