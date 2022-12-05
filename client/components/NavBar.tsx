import { Heading, Container } from "@chakra-ui/react";
import Link from "next/link";

export default function () {
  return (
    <Container p="2em" centerContent>
      <Heading
        as={Link}
        href="/"
        fontWeight="bold"
        fontSize="64"
        _hover={{ color: "spotifyLightGreen" }}
        // style={{ textDecoration: "none" }} // Removes hover underline
      >
        Collagify
      </Heading>
    </Container>
  );
}
