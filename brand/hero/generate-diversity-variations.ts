#!/usr/bin/env tsx
/**
 * Generate hero image variations with STRONG diversity emphasis
 *
 * Problem: Previous batches used "Diverse women" which resulted in all white women
 * Solution: Explicit, detailed diversity language emphasizing global majority
 *
 * This script generates variations with different phrasings to ensure
 * true representation of Future California ecotopia - global majority,
 * ethnicity-ambiguous, mixed heritage
 */

import { readFileSync } from "fs";
import { promises as fs } from "fs";
import path from "path";

// Load environment variables synchronously BEFORE any imports that might use them
const envPath = path.join(process.cwd(), ".env");
try {
  const envContent = readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      const value = valueParts.join("=").trim();
      if (key && value) {
        process.env[key.trim()] = value;
      }
    }
  });
  console.log("✓ Environment variables loaded from .env");
} catch (error) {
  console.error("Warning: Could not load .env file:", error);
}

import { ReplicateClient } from "../../skills/generate-image/src/replicate-client.js";
import { HERO_PROMPT_CONFIG } from "../../skills/generate-image/src/prompt-builder.js";

/**
 * Build prompt with explicit diversity language
 */
function buildDiversityPrompt(diversityPhrase: string): string {
  const baseAesthetic =
    "Candid scene from an eco-futurist utopian divine feminine society";
  const filmStyle =
    "1980s-meets-2180s. Kodak Eastman 100T 5247 35mm film, grain, halation, faded warm colors, natural lens flares, shallow depth-of-field.";

  const sceneDesc = `${HERO_PROMPT_CONFIG.timeOfDay}, ${HERO_PROMPT_CONFIG.sceneDescription}`;

  const deviceClause = `Selenite crystal devices with ${HERO_PROMPT_CONFIG.screenContent}.`;

  // USE EXPLICIT DIVERSITY PHRASE instead of vague "Diverse women"
  const visualElements = `${diversityPhrase} in flowing white, black, or iridescent gauzey cotton max-dresses, opal, labradorite, moonstone, amethyst jewelry, silver, black, or iridescent fingernails.`;

  const mood =
    "Soft, peaceful, gentle, pastoral cybernetic merging of femininity & technology.";

  const figuresClause = " Figures softly blurred in background.";

  const prompt = [
    baseAesthetic,
    sceneDesc,
    filmStyle,
    deviceClause,
    visualElements,
    mood,
    figuresClause,
  ]
    .filter(Boolean)
    .join(" ");

  return prompt;
}

// Define diversity phrase variations
const diversityVariations = [
  {
    name: "Global Majority Explicit",
    phrase: "Women of many ethnicities - Black, South Asian, East Asian, Latina, Indigenous, Middle Eastern, mixed heritage",
    description: "Explicit listing of ethnicities with global majority emphasis"
  },
  {
    name: "Melanin-Rich Focus",
    phrase: "Global majority women, melanin-rich and ethnicity-ambiguous beauties representing all continents",
    description: "Emphasis on melanin-rich, global majority"
  },
  {
    name: "Multiracial Sisterhood",
    phrase: "Multiracial sisterhood of Black women, brown women, Asian women, Indigenous women, mixed-race women",
    description: "Sisterhood framing with explicit racial categories"
  },
  {
    name: "Future California Ecotopia",
    phrase: "Future California ecotopia - women of African, Asian, Indigenous, and Latina descent alongside white women",
    description: "Future California framing with continental origins"
  },
  {
    name: "Continental Origins",
    phrase: "Women from Africa, Asia, Latin America, Indigenous Americas, Middle East, Pacific Islands, and Europe",
    description: "Geographic/continental origin approach"
  },
  {
    name: "Melanated Majority",
    phrase: "Melanated women of Black, Brown, Asian, Indigenous, and mixed ancestries",
    description: "Melanated as primary descriptor with ancestries"
  },
  {
    name: "BIPOC Centered",
    phrase: "BIPOC women - Black, Indigenous, People of Color with varied skin tones from deep brown to olive to tan",
    description: "BIPOC framing with skin tone specificity"
  },
  {
    name: "Skin Tone Spectrum",
    phrase: "Women with skin tones ranging from deep ebony to warm mahogany to golden brown to olive to tan, representing global diversity",
    description: "Direct skin tone description approach"
  },
];

async function generateDiversityBatch() {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    throw new Error(
      "REPLICATE_API_TOKEN environment variable is required. " +
      "Get your token from: Replicate Dashboard -> Account Settings -> API tokens"
    );
  }

  const client = new ReplicateClient(apiToken);
  const outputDir = path.join(process.cwd(), "brand/hero/archive");
  const logPath = path.join(process.cwd(), "brand/hero/GENERATION_LOG.md");

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  console.log("\n🌍 Starting diversity-focused hero image generation...\n");
  console.log("GOAL: True global majority representation\n");
  console.log(`Variations to generate: ${diversityVariations.length}\n`);
  console.log(`Output directory: ${outputDir}\n`);

  const results: Array<{
    variationName: string;
    phrase: string;
    prompt: string;
    imagePath: string;
    timestamp: string;
  }> = [];

  for (const variation of diversityVariations) {
    console.log(`\n${"=".repeat(70)}`);
    console.log(`${variation.name}`);
    console.log(`${variation.description}`);
    console.log(`${"=".repeat(70)}\n`);

    const prompt = buildDiversityPrompt(variation.phrase);
    console.log(`Prompt: ${prompt}\n`);

    try {
      // Generate image via Replicate
      const imageUrls = await client.generateImage(
        prompt,
        "16:9",
        "2K"
      );

      // Download first image from the output
      const imageUrl = imageUrls[0];
      const timestamp = new Date().toISOString().replace(/:/g, "-").split(".")[0];
      const filename = `hero-${timestamp}-diversity.png`;
      const imagePath = path.join(outputDir, filename);

      await client.downloadImage(imageUrl, imagePath);

      // Record result
      results.push({
        variationName: variation.name,
        phrase: variation.phrase,
        prompt,
        imagePath,
        timestamp: new Date().toISOString(),
      });

      console.log(`✅ Generated: ${filename}\n`);

      // Add delay between generations to respect rate limits
      if (diversityVariations.indexOf(variation) < diversityVariations.length - 1) {
        console.log("Rate limit throttle: waiting 150ms before next generation...\n");
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    } catch (error) {
      console.error(`❌ Failed to generate ${variation.name}:`, error);
    }
  }

  // Append to existing generation log
  let logContent = await fs.readFile(logPath, "utf-8");

  logContent += `\n## Diversity-Focused Variations (Generated: ${new Date().toISOString()})\n\n`;
  logContent += `**Goal:** Address lack of diversity in previous generations\n`;
  logContent += `**Problem:** "Diverse women" prompt resulted in all white women\n`;
  logContent += `**Solution:** Explicit diversity language emphasizing global majority\n`;
  logContent += `**User's favorite:** hero-2026-01-24T23-43-14-3.png (background figures composition)\n\n`;

  logContent += `### Batch 9 - Global Majority Emphasis\n\n`;
  logContent += `**Description:** Background figures composition with MUCH stronger diversity/global-majority emphasis\n\n`;
  logContent += `**Configuration:**\n`;
  logContent += `- Scene: ${HERO_PROMPT_CONFIG.sceneDescription}\n`;
  logContent += `- Figures: background_figures (softly blurred)\n`;
  logContent += `- Screen content: ${HERO_PROMPT_CONFIG.screenContent}\n`;
  logContent += `- Time of day: ${HERO_PROMPT_CONFIG.timeOfDay}\n`;
  logContent += `- Variations: ${results.length} (different diversity phrasings)\n\n`;

  logContent += `**Diversity Phrasings Tested:**\n\n`;
  logContent += `| # | Variation Name | Diversity Phrase |\n`;
  logContent += `|---|----------------|------------------|\n`;

  results.forEach((result, idx) => {
    logContent += `| ${idx + 1} | ${result.variationName} | ${result.phrase} |\n`;
  });

  logContent += `\n**Generated Images:**\n\n`;
  logContent += `| # | Timestamp | Filename | Variation |\n`;
  logContent += `|---|-----------|----------|----------|\n`;

  results.forEach((result, idx) => {
    const filename = path.basename(result.imagePath);
    logContent += `| ${idx + 1} | ${result.timestamp} | ${filename} | ${result.variationName} |\n`;
  });

  logContent += `\n`;

  await fs.writeFile(logPath, logContent);

  console.log(`\n${"=".repeat(70)}`);
  console.log(`✨ Diversity batch generation complete!`);
  console.log(`${"=".repeat(70)}`);
  console.log(`\nTotal images: ${results.length}`);
  console.log(`Output: ${outputDir}`);
  console.log(`Log updated: ${logPath}\n`);

  console.log(`\n📊 Summary of diversity approaches:\n`);
  results.forEach((result, idx) => {
    console.log(`${idx + 1}. ${result.variationName}`);
    console.log(`   "${result.phrase}"`);
    console.log(`   File: ${path.basename(result.imagePath)}\n`);
  });
}

// Run generation
generateDiversityBatch().catch(console.error);
