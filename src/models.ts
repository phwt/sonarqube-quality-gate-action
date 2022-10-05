export interface QualityGate {
  projectStatus: ProjectStatus;
}

export interface ProjectStatus {
  status: string;
  conditions: Condition[];
  periods: Period[];
  ignoredConditions: boolean;
}

export interface Condition {
  status: string;
  metricKey: string;
  comparator: string;
  errorThreshold: string;
  actualValue: string;
  periodIndex?: number;
}

export interface Period {
  index: number;
  mode: string;
  date: Date;
  parameter: string;
}
