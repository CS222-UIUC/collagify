import { Button, Container, Heading, Link, Text } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import PageWrapper from "../components/PageWrapper";

export default function ErrorPage() {
  return (
    <PageWrapper {...{ subtitle: "404 Error" }}>
      {/* TODO: Also center container vertically */}
      <Container maxW="xl" h="full" centerContent>
        <Heading mt="1em">404 Error: Page Not Found</Heading>
        <Text m="1em" fontSize="xl" fontWeight="bold">
          Alas, we cannot find the page that this URL leads to. Let's get you
          back home!
        </Text>
        <Button
          as={Link}
          href="/"
          bgColor="spotifyDarkGreen"
          color="spotifyBlack"
          _hover={{ color: "spotifyBlack", bgColor: "spotifyLightGreen" }}
          style={{ textDecoration: "none" }} // Removes hover underline
        >
          Home Page
        </Button>
      </Container>
    </PageWrapper>
  );
}
