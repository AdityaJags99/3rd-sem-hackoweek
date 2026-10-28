// Component composition: "children" lets the parent decide what goes inside.
function SectionHeading({ eyebrow, title, titleId, children }) {
    return (
        <div className="section-heading">
            <p className="eyebrow">{eyebrow}</p>
            <h2 id={titleId}>{title}</h2>
            {children}
        </div>
    );
}

export default SectionHeading;
