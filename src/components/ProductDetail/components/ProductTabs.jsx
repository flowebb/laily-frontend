import { TabButton } from './UIHelpers';

const ProductTabs = () => {
  return (
    <div
      style={{
        marginTop: '4rem',
        borderTop: '1px solid #e5e5e5',
        borderBottom: '1px solid #e5e5e5',
        display: 'flex',
      }}
    >
      <TabButton active label="DETAIL" />
      <TabButton label="GUIDE" />
      <TabButton label="REVIEW" />
      <TabButton label="Q&A" />
    </div>
  );
};

export default ProductTabs;

