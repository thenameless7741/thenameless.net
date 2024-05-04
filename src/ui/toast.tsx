import { X } from '@phosphor-icons/react/dist/ssr';
import {
  useToast,
  useToastRegion,
  AriaToastProps,
  AriaToastRegionProps,
} from '@react-aria/toast';
import {
  useToastState,
  ToastState as AriaToastState,
} from '@react-stately/toast';

import { useRef } from 'react';

import IconButton from './icon-button';
import s from './toast.module.scss';

type Props<T> = AriaToastProps<T> & {
  state: ToastState<T>;
};

const Toast = <T extends object>({ state, ...props }: Props<T>) => {
  const ref = useRef<HTMLDivElement>(null);
  const { closeButtonProps, titleProps, toastProps } = useToast(
    props,
    state,
    ref,
  );

  return (
    <div ref={ref} className={s.toast} {...toastProps}>
      <div {...titleProps}>{props.toast.content as React.ReactNode}</div>

      <IconButton {...closeButtonProps} Icon={X} weight="bold" />
    </div>
  );
};
export default Toast;

export type ToastState<T> = AriaToastState<T>;

type ProviderProps<T> = {
  children: (state: ToastState<T>) => React.ReactNode;
};

export const ToastProvider = <T extends object>({
  children,
  ...props
}: ProviderProps<T>) => {
  const state = useToastState<T>({
    maxVisibleToasts: 3,
  });

  return (
    <>
      {children(state)}
      {state.visibleToasts.length > 0 && (
        <ToastRegion {...props} state={state} />
      )}
    </>
  );
};

type RegionProps<T> = {
  state: ToastState<T>;
} & AriaToastRegionProps;

const ToastRegion = <T extends object>({ state, ...props }: RegionProps<T>) => {
  const ref = useRef<HTMLDivElement>(null);
  const { regionProps } = useToastRegion(props, state, ref);

  return (
    <div ref={ref} className={s.region} {...regionProps}>
      {state.visibleToasts.map((t) => (
        <Toast key={t.key} state={state} toast={t} />
      ))}
    </div>
  );
};
