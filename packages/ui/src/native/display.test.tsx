// The static primitives: Txt, Card, Badge, Avatar, Skeleton, EmptyState, Spinner.
import { describe, expect, jest, test } from "@jest/globals";
import { themes } from "@krizaka/tokens/native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import * as React from "react";
import { StyleSheet, Text } from "react-native";

import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Card } from "./card";
import { EmptyState } from "./empty-state";
import { Skeleton } from "./skeleton";
import { Spinner } from "./spinner";
import { ThemeProvider } from "./theme";
import { Txt } from "./txt";

const color = (element: { props: { style?: unknown } }) => (StyleSheet.flatten(element.props.style as never) as { color?: string }).color;

describe("Txt", () => {
  test("a tone is a role of the current theme", async () => {
    await render(
      <ThemeProvider mode="light">
        <Txt tone="secondary">hello</Txt>
      </ThemeProvider>,
    );
    expect(color(screen.getByText("hello"))).toBe(themes.light.textSecondary);
  });

  test("title and display are headers", async () => {
    await render(<Txt variant="title">Wallet</Txt>);
    expect(screen.getByRole("heading", { name: "Wallet" })).toBeOnTheScreen();
  });
});

describe("Card", () => {
  test("the parts compose; the title is a header", async () => {
    await render(
      <Card.Root>
        <Card.Media>
          <Card.Image src={null} fallback={<Text>art</Text>} />
          <Card.Overlay corner="top-right">
            <Badge tone="scrim">Live</Badge>
          </Card.Overlay>
        </Card.Media>
        <Card.Body>
          <Card.Title>Night set</Card.Title>
          <Card.Description>Forty minutes</Card.Description>
        </Card.Body>
        <Card.Footer>
          <Text>footer</Text>
        </Card.Footer>
      </Card.Root>,
    );
    expect(screen.getByRole("heading", { name: "Night set" })).toBeOnTheScreen();
    expect(screen.getByText("Forty minutes")).toBeOnTheScreen();
    expect(screen.getByText("footer")).toBeOnTheScreen();
  });

  test("onPress makes the card a button", async () => {
    const onPress = jest.fn();
    await render(
      <Card.Root onPress={onPress}>
        <Card.Title>Night set</Card.Title>
      </Card.Root>,
    );
    await fireEvent.press(screen.getByRole("button", { name: "Night set" }));
    expect(onPress).toHaveBeenCalled();
  });
});

describe("Badge", () => {
  test("text and a decorative dot", async () => {
    await render(
      <Badge tone="danger" dot pulse>
        Ending
      </Badge>,
    );
    expect(screen.getByText("Ending")).toBeOnTheScreen();
  });
});

describe("Avatar", () => {
  test("an image named by alt", async () => {
    await render(<Avatar src="https://example.com/a.png" alt="Ada" />);
    expect(screen.getByRole("img", { name: "Ada" })).toBeOnTheScreen();
  });

  test("an image that fails to load gives way to the initial", async () => {
    await render(<Avatar src="https://example.com/broken.png" alt="Bo" testID="avatar" />);
    expect(screen.queryByText("B")).toBeNull();
    await fireEvent(screen.getByTestId("avatar.image"), "error");
    expect(screen.getByText("B")).toBeOnTheScreen();
  });

  test("without an image: the initial", async () => {
    await render(<Avatar alt="ada" size="lg" />);
    expect(screen.getByText("A")).toBeOnTheScreen();
  });

  test("Avatar.Group counts the rest past max", async () => {
    await render(
      <Avatar.Group max={2}>
        <Avatar alt="Ada" />
        <Avatar alt="Bo" />
        <Avatar alt="Cy" />
        <Avatar alt="Di" />
      </Avatar.Group>,
    );
    expect(screen.getByText("+2")).toBeOnTheScreen();
    expect(screen.queryByText("C")).toBeNull();
  });
});

describe("Skeleton, EmptyState, Spinner", () => {
  test("a skeleton is hidden from screen readers", async () => {
    await render(<Skeleton shape="circle" testID="sk" />);
    expect(screen.getByTestId("sk", { includeHiddenElements: true })).not.toBeVisible();
  });

  test("an empty state: a header, a line, an action", async () => {
    await render(<EmptyState icon={<Text>i</Text>} title="Nothing yet" description="Follow a creator" action={<Text>Explore</Text>} />);
    expect(screen.getByRole("heading", { name: "Nothing yet" })).toBeOnTheScreen();
    expect(screen.getByText("Follow a creator")).toBeOnTheScreen();
    expect(screen.getByText("Explore")).toBeOnTheScreen();
  });

  test("a spinner is a named progress bar", async () => {
    await render(<Spinner label="Loading" />);
    expect(screen.getByRole("progressbar", { name: "Loading" })).toBeOnTheScreen();
  });
});
