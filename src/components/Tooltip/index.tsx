import React from 'react';

import { Container } from './styles';

interface TooltipProps {
  title: string;
  clasName?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  title,
  children,
  clasName = '',
}) => {
  return (
    <Container className={clasName}>
      {children}
      <span>{title}</span>
    </Container>
  );
};
export default Tooltip;
