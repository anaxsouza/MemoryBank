import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import React from 'react';
import { Header } from '../source/components/header.js';
import { HealthCard } from '../source/components/health-card.js';
import { NamespaceCard } from '../source/components/namespace-card.js';
import { MemoryCard } from '../source/components/memory-card.js';
import { IngestCard } from '../source/components/ingest-card.js';

describe('Header', () => {
  it('shows connected status', () => {
    const { lastFrame } = render(
      <Header isConnected={true} lastUpdated={new Date('2026-04-11T20:00:00')} />
    );
    expect(lastFrame()).toContain('Connected');
    expect(lastFrame()).toContain('Memory Bank');
  });

  it('shows disconnected status', () => {
    const { lastFrame } = render(
      <Header isConnected={false} lastUpdated={null} />
    );
    expect(lastFrame()).toContain('Disconnected');
  });
});

describe('HealthCard', () => {
  it('renders health information', () => {
    const health = {
      ok: true,
      namespace: 'test-namespace',
      port: 3737,
      llm_provider: 'open-ai',
      encoder_provider: 'fast-embed',
      llm_model_id: 'OpenAi::gpt-4',
      encoder_model_id: 'FastEmbed::model',
      version: '0.2.0',
    };

    const { lastFrame } = render(<HealthCard health={health} />);
    expect(lastFrame()).toContain('test-namespace');
    expect(lastFrame()).toContain('3737');
    expect(lastFrame()).toContain('0.2.0');
  });
});

describe('NamespaceCard', () => {
  it('renders namespace information', () => {
    const namespace = {
      name: 'AI_Brain',
      db_path: '/home/user/.memory_bank/namespaces/AI_Brain/memory.db',
      db_size_bytes: 72704000,
    };

    const { lastFrame } = render(<NamespaceCard namespace={namespace} />);
    expect(lastFrame()).toContain('AI_Brain');
    expect(lastFrame()).toContain('MB');
    expect(lastFrame()).toContain('memory.db');
  });
});

describe('MemoryCard', () => {
  it('renders memory statistics', () => {
    const memories = {
      total_count: 609,
      earliest_timestamp: '2026-02-24T15:04:25.156Z',
      latest_timestamp: '2026-04-11T22:48:24.020022+00:00',
      unique_tags: ['AI', 'rust', 'memory'],
      unique_keywords: ['neural', 'embeddings'],
    };

    const { lastFrame } = render(<MemoryCard memories={memories} />);
    expect(lastFrame()).toContain('609');
    expect(lastFrame()).toContain('Tags (3)');
    expect(lastFrame()).toContain('Keywords (2)');
  });
});

describe('IngestCard', () => {
  it('renders ingest statistics', () => {
    const ingest = {
      turns_by_status: [
        { status: 'stored', count: 38 },
        { status: 'processing', count: 2 },
        { status: 'open', count: 1 },
      ],
    };

    const { lastFrame } = render(<IngestCard ingest={ingest} />);
    expect(lastFrame()).toContain('Total Turns');
    expect(lastFrame()).toContain('stored');
    expect(lastFrame()).toContain('processing');
    expect(lastFrame()).toContain('38');
  });

  it('shows empty state when no data', () => {
    const ingest = {
      turns_by_status: [],
    };

    const { lastFrame } = render(<IngestCard ingest={ingest} />);
    expect(lastFrame()).toContain('No ingest data');
  });
});
