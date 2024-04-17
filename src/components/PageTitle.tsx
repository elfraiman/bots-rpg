
interface IPageTitleProps {
  title: string;
  subtitle: string;
}

const PageTitle = ({ title, subtitle }: IPageTitleProps) => {

  return (
    <div className={`ion-padding low-fade corner-border`} style={{ margin: "16px 0 16px 0" }}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <p>{subtitle}</p>
    </div>
  )
}

export default PageTitle;