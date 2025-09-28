import { Container } from "@/components/layout/Container";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <Container>
        <p>Hello</p>
      </Container>
    </div>
  );
}

export default Index;
