export default function SectionBackdrop({ variant = 'default' }) {
  const variants = {
    default: (
      <>
        <div className="section-bg-orb section-bg-orb--orange" />
        <div className="section-bg-orb section-bg-orb--purple" />
        <div className="section-bg-grid" />
        <div className="section-bg-gradient" />
      </>
    ),
    warm: (
      <>
        <div className="section-bg-orb section-bg-orb--orange section-bg-orb--lg" />
        <div className="section-bg-orb section-bg-orb--amber" />
        <div className="section-bg-grid" />
      </>
    ),
    cool: (
      <>
        <div className="section-bg-orb section-bg-orb--purple section-bg-orb--lg" />
        <div className="section-bg-orb section-bg-orb--orange section-bg-orb--sm" />
        <div className="section-bg-grid" />
      </>
    ),
  };

  return (
    <div className="section-backdrop" aria-hidden="true">
      {variants[variant] || variants.default}
    </div>
  );
}
