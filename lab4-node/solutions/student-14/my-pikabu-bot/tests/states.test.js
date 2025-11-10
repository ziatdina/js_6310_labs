import { describe, test, expect } from '@jest/globals';
import { states } from '../src/utils/states.js';

describe('Состояния бота', () => {
  test('содержит все необходимые состояния', () => {
    expect(states).toHaveProperty('wait');
    expect(states).toHaveProperty('category');
    expect(states).toHaveProperty('frequency');
    expect(states).toHaveProperty('sources');
    expect(states).toHaveProperty('completed');
  });

  test('состояния имеют правильные значения', () => {
    expect(states.wait).toBe('waiting');
    expect(states.category).toBe('choose_category');
    expect(states.frequency).toBe('choose_frequency');
    expect(states.sources).toBe('choose_sources');
    expect(states.completed).toBe('completed');
  });
});