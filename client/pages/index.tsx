import { Text, Button, Container, Heading } from "@chakra-ui/react";
import Link from "next/link";
import PageWrapper from "../components/PageWrapper";

export default function Home() {
  return (
    <PageWrapper {...{ subtitle: "404 Error" }}>
      {/* TODO: Also center container vertically */}
      <Container maxW="xl" h="full" centerContent>
        {/* TODO: Better homepage lol */}
        <Heading mt="1em">Let's make a Collage!</Heading>
        <Button
          as={Link}
          href="/editor"
          bgColor="spotifyDarkGreen"
          color="spotifyBlack"
          _hover={{ color: "spotifyBlack", bgColor: "spotifyLightGreen" }}
          style={{ textDecoration: "none" }} // Removes hover underline
        >
          Editor
        </Button>
      </Container>
    </PageWrapper>
  );
}
