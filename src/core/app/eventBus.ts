import mitt from 'mitt';

type Events = {
  'documents-updated': {
    success: unknown[];
    failed: unknown[];
  };
};

export const bus = mitt<Events>();
