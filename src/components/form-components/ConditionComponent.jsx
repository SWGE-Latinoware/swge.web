import React, { useMemo } from 'react';

const ConditionComponent = (props) => {
  const {
    condition, TrueComponent, trueProps, FalseComponent, falseProps, children, ...otherProps
  } = props;

  const Component = useMemo(() => (condition ? TrueComponent : FalseComponent), [FalseComponent, TrueComponent, condition]);
  const correctProps = useMemo(() => (condition ? trueProps || {} : falseProps || {}), [condition, falseProps, trueProps]);

  return (
    <Component
      {...otherProps}
      {...correctProps}
    >
      {children}
    </Component>
  );
};

export default ConditionComponent;
