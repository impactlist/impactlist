import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { describe, expect, it } from 'vitest';
import { donations, donorsById } from './generatedData';

// Donors excluded via the `.md.excluded` convention (content/README.md,
// "Excluding a donor") must stay out of the generated data. Self-maintaining:
// this iterates whatever excluded files exist, so restoring a donor doesn't
// break it and future exclusions are covered automatically.
const donorsDir = path.resolve(process.cwd(), 'content/donors');
const excludedDonorIds = fs
  .readdirSync(donorsDir)
  .filter((file) => file.endsWith('.md.excluded'))
  .map((file) => {
    const source = fs.readFileSync(path.join(donorsDir, file), 'utf8');
    const match = source.match(/^id:\s*'([^']+)'/m);
    if (!match) {
      throw new Error(`Could not parse an id from excluded donor file ${file}`);
    }
    return match[1];
  });

describe('excluded content', () => {
  it('keeps excluded donors out of the generated data', () => {
    for (const donorId of excludedDonorIds) {
      expect(donorsById, `excluded donor ${donorId} present in donorsById`).not.toHaveProperty(donorId);
      expect(
        donations.some((donation) => donation.donorId === donorId),
        `donations still credited to excluded donor ${donorId}`
      ).toBe(false);
    }
  });
});
