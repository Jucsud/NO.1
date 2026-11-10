import test from 'node:test';
import assert from 'node:assert/strict';
import { formatAgeOrdinal, sanitizeBirthdayConfig, defaultBirthdayConfig } from '../config/birthdayConfig';

test('formatAgeOrdinal converts integers to correct English ordinals', () => {
  assert.equal(formatAgeOrdinal(1), '1st');
  assert.equal(formatAgeOrdinal(2), '2nd');
  assert.equal(formatAgeOrdinal(3), '3rd');
  assert.equal(formatAgeOrdinal(4), '4th');
  assert.equal(formatAgeOrdinal(11), '11th');
  assert.equal(formatAgeOrdinal(12), '12th');
  assert.equal(formatAgeOrdinal(13), '13th');
  assert.equal(formatAgeOrdinal(21), '21st');
  assert.equal(formatAgeOrdinal(22), '22nd');
  assert.equal(formatAgeOrdinal(23), '23rd');
  assert.equal(formatAgeOrdinal(25), '25th');
  assert.equal(formatAgeOrdinal(30), '30th');
  assert.equal(formatAgeOrdinal(0), '');
  assert.equal(formatAgeOrdinal(null), '');
  assert.equal(formatAgeOrdinal(undefined), '');
});

test('sanitizeBirthdayConfig preserves valid custom values', () => {
  const custom = sanitizeBirthdayConfig({
    celebrantName: 'Alexandra',
    age: 30,
    celebrationDate: 'December 25',
  });

  assert.equal(custom.celebrantName, 'Alexandra');
  assert.equal(custom.age, 30);
  assert.equal(custom.celebrationDate, 'December 25');
  assert.equal(custom.hero.mainTitle, defaultBirthdayConfig.hero.mainTitle);
  assert.equal(custom.gallery.photos.length, defaultBirthdayConfig.gallery.photos.length);
});

test('sanitizeBirthdayConfig falls back gracefully when fields are blank', () => {
  const sanitized = sanitizeBirthdayConfig({
    celebrantName: '   ',
    celebrationDate: '',
  });

  assert.equal(sanitized.celebrantName, defaultBirthdayConfig.celebrantName);
  assert.equal(sanitized.celebrationDate, defaultBirthdayConfig.celebrationDate);
});
