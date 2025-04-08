import React from 'react';
import styled from '@emotion/styled';
import canaryImage from '../assets/images/archetype/canary.png';

const Image = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const ArchetypeCard = () => {
  return <Image src={canaryImage} alt="archetype character" />;
};

export default ArchetypeCard; 