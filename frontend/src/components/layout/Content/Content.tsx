import React from 'react';

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
}


const Content: React.FC<ContentProps> = (props) => {
  const { title, children, ...options } = props;

  return (
    <div style={{display: "flex", justifyContent: "center"}}>
      <div style={{width: "100%", maxWidth: "1200px"}} >
        <h1 style={{textAlign: "center"}}>{title}</h1>
        <div {...options}>
          { children }
        </div>
      </div>
    </div>
  );
};

export default Content;