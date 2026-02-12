
export interface Service {
  icon: string;
  title: string;
  desc: string;
}

export interface Competitor {
  id: number;
  name: string;
  pros: string[];
  cons: string[];
}

export interface ComparisonRow {
  challenge: string;
  competitorIssue: string;
  ourSolution: string;
}

export interface Stat {
  val: string;
  label: string;
}

export interface Inquiry {
  name: string;
  phone: string;
  projectType: string;
  createdAt: any;
}
