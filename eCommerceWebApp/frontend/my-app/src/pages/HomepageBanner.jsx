const HomepageBanner = ({
  divContent,
  spanContent,
  divClassName,
  spanClassName,
}) => {
  return (
    <div className={divClassName}>
      {divContent}
      <span className={spanClassName}>{spanContent}</span>
    </div>
  );
};

export default HomepageBanner;
