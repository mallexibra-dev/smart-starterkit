export const Navbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <nav>
      <h1>Hello Navbar</h1>
      <div>{children}</div>
    </nav>
  );
};
