export interface IComponentsData {
  value: string;
  component: {
    id: number;
    pin: number;
    room: number;
    type: string;
  };
}

export interface updateComponentValue {
  id: number;
  value: string | number;
}
