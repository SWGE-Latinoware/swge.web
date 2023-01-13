import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

const HelmetW = (props) => {
  const { title } = props;

  const [favIcon, setFavIcon] = useState('/grupo_161.svg');

  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      setFavIcon(event.matches ? '/grupo_161.svg' : '/grupo_160.svg');
    });
  }, []);

  const getTitle = () => {
    if (Array.isArray(title)) {
      if (typeof title[title.length - 1] === 'object') return title[title.length - 1].title;
      return title[title.length - 1];
    }
    if (typeof title === 'object') return title.title;
    return title;
  };

  return (
    <Helmet>
      {title && <title>{getTitle()}</title>}
      <link rel="icon" type="image/png" href={favIcon} />
    </Helmet>
  );
};

export default HelmetW;
