import { useMemo } from 'react';
import BaseService from '.';
type Service = typeof BaseService;
export default function useService<S extends Service>(Service: S): InstanceType<S> {
  return useMemo(() => new Service() as InstanceType<S>, [Service]);
}
