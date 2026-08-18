import { describe, it, expect } from 'vitest';
import { generateSmartFallbackRecommendation } from '../../server';
import { 
  REELS_DATASET, 
  CANDIDATE_RECOMMENDATION_REELS, 
  INITIAL_INTEREST_DOMAINS 
} from '../data/reelsDataset';
import { RecommendationResult, ReelItem } from '../types';

describe('Recommendation Engine Core Logic', () => {
  // Candidate pool lookup helper
  const candidateIds = new Set(CANDIDATE_RECOMMENDATION_REELS.map((c) => c.id));

  /**
   * TEST 1: Anti-Hype Filter & Educational Ranking
   * Verifies the anti-hype filter penalizes clickbait/hype claims and routes
   * to substantive, rigorous technical content rather than superficial traps.
   */
  describe('1. Anti-Hype Filter & Substantive Technical Ranking', () => {
    it('correctly flags clickbait-style hype reels and applies anti-hype penalty', () => {
      const clickbaitReel: ReelItem = {
        id: 'test-clickbait-ai',
        title: 'How to make $1,000,000 using AI agents without coding! 🚀💰',
        caption: 'Quit your job! Secret prompt automates 50 SaaS apps in 15 minutes!',
        transcript: 'Stop learning programming right now! This secret prompt prints money on autopilot while you sleep. Guaranteed job and earn $500k in 15 minutes!',
        category: 'AI / Passive Income',
        hashtags: ['#makemoney', '#ai', '#secretprompt'],
        author: 'Hype Guru',
        authorHandle: '@hype_master',
        difficulty: 'Beginner',
        duration: '0:45',
        views: '800k',
        likes: '90k',
        isHypeOrClickbait: true,
        technicalConcepts: ['None', 'Superficial AI Claims'],
        thumbnailGradient: 'from-purple-500 to-indigo-900',
      };

      const result = generateSmartFallbackRecommendation(
        clickbaitReel,
        [],
        INITIAL_INTEREST_DOMAINS
      ) as RecommendationResult;

      // Verify anti-hype shield activations
      expect(result.hypePenaltyApplied).toBe(true);
      expect(result.currentReel.hypeScore).toBeGreaterThanOrEqual(80);
      expect(result.currentReel.contentType).toContain('Hype');
      expect(result.hypePenaltyExplanation).toBeDefined();
      expect(result.why).toContain('superficial');

      // Verify it filters through to genuine technical depth (e.g. AI Systems / Architecture)
      expect(candidateIds.has(result.recommendedTechReel.id)).toBe(true);
      expect(result.recommendedTechReel.difficulty).toBeDefined();
      expect(['Beginner', 'Intermediate', 'Advanced', 'Deep Dive']).toContain(result.recommendedTechReel.difficulty);
    });

    it('ranks and validates substantive educational reels with 0% hype penalty and high confidence', () => {
      const educationalReel: ReelItem = {
        id: 'test-substantive-db',
        title: 'PostgreSQL MVCC & Vacuum: How Tuple Freezing Prevents Transaction ID Wraparound',
        caption: 'Explaining multi-version concurrency control, dead tuple bloat, and autovacuum mechanics.',
        transcript: 'Every UPDATE in PostgreSQL writes a new row tuple with an incremented xmin header while marking the old tuple xmax. Autovacuum must freeze old transaction IDs before reaching 2 billion transactions to prevent silent data corruption.',
        category: 'Database Internals & Storage',
        hashtags: ['#postgresql', '#database', '#mvcc', '#storage'],
        author: 'Tariq Al-Mansoor',
        authorHandle: '@tariq_db',
        difficulty: 'Advanced',
        duration: '0:58',
        views: '120k',
        likes: '18k',
        isHypeOrClickbait: false,
        technicalConcepts: ['MVCC Dead Tuples', 'Vacuum Freeze', 'Transaction ID Wraparound', 'Heap Tuple Headers'],
        thumbnailGradient: 'from-emerald-500 to-teal-900',
      };

      const result = generateSmartFallbackRecommendation(
        educationalReel,
        [],
        INITIAL_INTEREST_DOMAINS
      ) as RecommendationResult;

      // Substantive reel must not suffer hype penalties
      expect(result.hypePenaltyApplied).toBe(false);
      expect(result.currentReel.hypeScore).toBeLessThanOrEqual(20);
      expect(result.confidence).toBeGreaterThanOrEqual(85);
      expect(result.currentReel.contentType).toContain('Technical Architecture');
    });
  });

  /**
   * TEST 2: Non-Technical Reel Handling (Zero-Signal Evaluation)
   * Verifies that non-technical reels (hiking, comedy, dance, recipe, gaming, asmr)
   * produce low confidence (10-30%) and an honest "no clear technical interest"
   * verdict without forcing an artificial technical category.
   */
  describe('2. Non-Technical Zero-Signal Handling', () => {
    // Non-technical reels from the dataset
    const nonTechnicalDatasetReels = REELS_DATASET.filter((r) => 
      ['reel-dance-trend', 'reel-gaming-highlight', 'reel-comedy-skit', 'reel-food-recipe', 'reel-travel-vlog', 'reel-asmr-satisfying'].includes(r.id)
    );

    it('finds non-technical reels in the dataset', () => {
      expect(nonTechnicalDatasetReels.length).toBe(6);
    });

    nonTechnicalDatasetReels.forEach((reel) => {
      it(`honestly identifies dataset reel "${reel.title}" as zero-signal with low confidence (10-30%) and no forced category`, () => {
        const result = generateSmartFallbackRecommendation(
          reel,
          [],
          INITIAL_INTEREST_DOMAINS
        ) as RecommendationResult;

        // Low confidence strictly in the 10-30% range
        expect(result.confidence).toBeGreaterThanOrEqual(10);
        expect(result.confidence).toBeLessThanOrEqual(30);

        // Honest interest detected message
        expect(result.interestDetected.toLowerCase()).toContain('no clear technical interest');
        expect(result.interestDetected.toLowerCase()).toMatch(/general entertainment|gaming|lifestyle/);

        // Domain weights must not artificially inflate (all growth values should be 0)
        const totalGrowth = result.updatedInterestProfile.reduce((acc, curr) => acc + (curr.growth || 0), 0);
        expect(totalGrowth).toBe(0);

        // Content type reflects zero-signal
        expect(result.currentReel.contentType).toContain('Zero Technical Signal');
      });
    });
  });

  /**
   * TEST 3: Fixed Candidate Catalogue Integrity
   * Verifies that recommended tech reels are ALWAYS selected from the
   * fixed candidate catalog and never fabricated or invented.
   */
  describe('3. Candidate Catalogue Integrity', () => {
    it('always selects recommended tech reel from the fixed candidate catalogue', () => {
      // Test across the full REELS_DATASET
      for (const reel of REELS_DATASET) {
        const result = generateSmartFallbackRecommendation(
          reel,
          [],
          INITIAL_INTEREST_DOMAINS
        ) as RecommendationResult;

        const recommendedId = result.recommendedTechReel.id;
        
        // Assert ID is in candidate catalogue
        expect(candidateIds.has(recommendedId)).toBe(true);

        // Match against exact record in catalog
        const matchInCatalog = CANDIDATE_RECOMMENDATION_REELS.find((c) => c.id === recommendedId);
        expect(matchInCatalog).toBeDefined();
        expect(result.recommendedTechReel.title).toBe(matchInCatalog?.title);
        expect(result.recommendedTechReel.author).toBe(matchInCatalog?.author);
        expect(result.recommendedTechReel.category).toBe(matchInCatalog?.category);
      }
    });
  });

  /**
   * TEST 4: Required 8-Field Output Schema Conformance
   * Confirms that all 8 essential schema fields are strictly present:
   * 1. Current Reel
   * 2. Interest Detected
   * 3. Why
   * 4. Recommended Tech Reel
   * 5. Category
   * 6. Why This Recommendation
   * 7. Difficulty
   * 8. Confidence
   */
  describe('4. Required 8-Field Schema Conformance', () => {
    it('strictly satisfies the 8-field schema specification for any reel input', () => {
      const testReel = REELS_DATASET[0];
      const result = generateSmartFallbackRecommendation(
        testReel,
        [],
        INITIAL_INTEREST_DOMAINS
      ) as RecommendationResult;

      // Field 1: Current Reel (structured object)
      expect(result.currentReel).toBeDefined();
      expect(typeof result.currentReel.title).toBe('string');
      expect(result.currentReel.title.length).toBeGreaterThan(0);
      expect(result.currentReel.contentType).toBeDefined();
      expect(result.currentReel.extractedTopic).toBeDefined();
      expect(typeof result.currentReel.hypeScore).toBe('number');

      // Field 2: Interest Detected
      expect(typeof result.interestDetected).toBe('string');
      expect(result.interestDetected.trim().length).toBeGreaterThan(0);

      // Field 3: Why (analytical rationale)
      expect(typeof result.why).toBe('string');
      expect(result.why.trim().length).toBeGreaterThan(0);

      // Field 4: Recommended Tech Reel
      expect(result.recommendedTechReel).toBeDefined();
      expect(typeof result.recommendedTechReel.id).toBe('string');
      expect(typeof result.recommendedTechReel.title).toBe('string');
      expect(typeof result.recommendedTechReel.category).toBe('string');
      expect(typeof result.recommendedTechReel.difficulty).toBe('string');
      expect(typeof result.recommendedTechReel.author).toBe('string');
      expect(typeof result.recommendedTechReel.excerpt).toBe('string');
      expect(Array.isArray(result.recommendedTechReel.hashtags)).toBe(true);

      // Field 5: Category
      expect(typeof result.category).toBe('string');
      expect(result.category.trim().length).toBeGreaterThan(0);

      // Field 6: Why This Recommendation
      expect(typeof result.whyThisRecommendation).toBe('string');
      expect(result.whyThisRecommendation.trim().length).toBeGreaterThan(0);

      // Field 7: Difficulty
      expect(['Beginner', 'Intermediate', 'Advanced', 'Deep Dive']).toContain(result.difficulty);

      // Field 8: Confidence (calibrated percentage 0-100)
      expect(typeof result.confidence).toBe('number');
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);

      // Supplementary schema elements
      expect(typeof result.hypePenaltyApplied).toBe('boolean');
      expect(Array.isArray(result.updatedInterestProfile)).toBe(true);
      expect(Array.isArray(result.reasoningSteps)).toBe(true);
      expect(result.reasoningSteps.length).toBeGreaterThanOrEqual(3);
    });
  });

  /**
   * TEST 5: Borderline Reels with Shallow Technical Signals
   * Verifies that borderline content (e.g. laptop unboxing citing RAM/SoC specs,
   * streamer vlog optimizing OBS NVENC AV1 video encoding) produces calibrated
   * mid-range confidence (35-50%) and partial interest strength (+4-7%).
   */
  describe('5. Borderline Content Mid-Range Calibration', () => {
    it('calibrates laptop unboxing mentioning LPDDR5X/SoC specs to 35-50% confidence with hardware interest bump', () => {
      const unboxingReel = REELS_DATASET.find((r) => r.id === 'reel-borderline-unboxing')!;
      expect(unboxingReel).toBeDefined();

      const result = generateSmartFallbackRecommendation(
        unboxingReel,
        [],
        INITIAL_INTEREST_DOMAINS
      ) as RecommendationResult;

      // Mid-range confidence: 35-50%
      expect(result.confidence).toBeGreaterThanOrEqual(35);
      expect(result.confidence).toBeLessThanOrEqual(50);
      expect(result.interestDetected.toLowerCase()).toContain('partial technical signal');

      // Hardware architecture domain gets partial growth (+4% to +7%)
      const hardwareDomain = result.updatedInterestProfile.find((p) => p.key === 'hardware_arch');
      expect(hardwareDomain).toBeDefined();
      expect(hardwareDomain?.growth).toBeGreaterThanOrEqual(4);
      expect(hardwareDomain?.growth).toBeLessThanOrEqual(7);
    });

    it('calibrates streamer vlog mentioning OBS NVENC AV1 encoding to 35-50% confidence with web/engine bump', () => {
      const streamerReel = REELS_DATASET.find((r) => r.id === 'reel-borderline-gamer-vlog')!;
      expect(streamerReel).toBeDefined();

      const result = generateSmartFallbackRecommendation(
        streamerReel,
        [],
        INITIAL_INTEREST_DOMAINS
      ) as RecommendationResult;

      // Mid-range confidence: 35-50%
      expect(result.confidence).toBeGreaterThanOrEqual(35);
      expect(result.confidence).toBeLessThanOrEqual(50);
      expect(result.interestDetected.toLowerCase()).toContain('partial technical signal');

      // Web performance / engine runtime gets partial growth
      const webDomain = result.updatedInterestProfile.find((p) => p.key === 'web_performance');
      expect(webDomain).toBeDefined();
      expect(webDomain?.growth).toBeGreaterThanOrEqual(4);
      expect(webDomain?.growth).toBeLessThanOrEqual(7);
    });
  });
});
