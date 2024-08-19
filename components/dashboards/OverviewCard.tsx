const OverviewCard = ({ title, value }: { title: string; value: number }) => {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-md shadow-md">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-2xl">{value}</p>
      </div>
    );
  };
  
  export default OverviewCard;
  