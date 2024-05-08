import React from 'react';
import { PageContainer } from './styled';

interface PageProps {
  children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ children }) => {
  return <PageContainer>{children}</PageContainer>;
};

export default Page;
