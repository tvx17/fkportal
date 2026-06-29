export interface Detail {
  id: number;
  title: string;
  description: string;
  created: string;
  updated: string;
  imported: string;
  category: EditModel | null;
  documentType: EditModel | null;
  documentSubtype: EditModel | null;
  lifecycleStatus: EditModel | null;
  reviewStatus: EditModel | null;
  textSource: {
    sourceName: string;
  };
  attributes: {
    name: string;
    value: string;
  }[];
  issuer: {
    name: string;
  }[];
  parties: {
    name: string;
  }[];
  tags: {
    misc_tags_id: number;
    name: string;
  }[];
  dates: {
    name: string;
    value: string;
  }[];
}

export interface EditModel {
  id: number | string;
  name: string;
}

export interface Tag {
  misc_tags_id: number;
  name: string;
}
