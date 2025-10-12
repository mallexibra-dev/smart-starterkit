export const CustomToast = ({ message }: { message: string }) => {
  return (
    <div className="bg-blue-500 text-white p-4 rounded shadow">{message}</div>
  );
};
