import {
  Box,
  Button,
  Container,
  Flex,
  Link,
  useColorMode,
} from "@chakra-ui/react";

export default function Footer() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box h="6em" bg="spotifyGrey">
      <Container h="full" centerContent justifyContent="center">
        <Flex
          columnGap="1em"
          direction={{ base: "column", sm: "row" }}
          align={{ base: "flex-end", sm: "center" }}
        >
          <Link href="/" fontWeight="bold">
            Home
          </Link>
          <Link
            href="https://github.com/CS222-UIUC/collagify/"
            fontWeight="bold"
            isExternal
          >
            GitHub
          </Link>
          {/* TODO: Ensure theme defaults to dark mode, then remove this button. */}
          <Button
            onClick={toggleColorMode}
            fontWeight="bold"
            borderColor="white"
            variant="outline"
            _hover={{
              borderColor: "white",
            }}
          >
            Toggle {colorMode === "light" ? "Dark" : "Light"}
          </Button>
        </Flex>
      </Container>
    </Box>
  );
}
