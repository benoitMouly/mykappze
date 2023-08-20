import React from "react";
import { useSelector } from "react-redux";
import * as d3 from "d3";
import { Dimensions, ScrollView, View } from "react-native";
import {
  Svg,
  Path,
  Circle,
  Text,
  Defs,
  Pattern,
  Mask,
  Image as SvgImage,
  Line,
  G,
  ClipPath,
} from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { processFontFamily } from "expo-font";
import Icon from "react-native-vector-icons/Ionicons";

const MaleIcon = ({ fill = "none", stroke = "#fff", size = 20 }) => (
  <Svg
    height={size}
    width={size}
    viewBox="0 0 512 512"
    fill={fill}
    stroke={stroke}
  >
    <Path
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={32}
      d="M368 296 A152 152 0 0 1 216 448 A152 152 0 0 1 64 296 A152 152 0 0 1 368 296 z"
    />
    <Path
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={32}
      d="M448 160V64h-96M324 188L448 64"
    />
  </Svg>
);

const FemaleIcon = ({ fill = "none", stroke = "#fff", size = 20 }) => (
  <Svg
    height={size}
    width={size}
    viewBox="0 0 512 512"
    fill={fill}
    stroke={stroke}
  >
    <Path
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={32}
      d="M408 184 A152 152 0 0 1 256 336 A152 152 0 0 1 104 184 A152 152 0 0 1 408 184 z"
    />
    <Path
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={32}
      d="M256 336v144M314 416H198"
    />
  </Svg>
);

const QuestionIcon = ({ fill = "none", stroke = "#fff", size = 20 }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    height={size}
    width={size}
    viewBox="0 0 512 512"
  >
    <Path
      d="M160 164s1.44-33 33.54-59.46C212.6 88.83 235.49 84.28 256 84c18.73-.23 35.47 2.94 45.48 7.82C318.59 100.2 352 120.6 352 164c0 45.67-29.18 66.37-62.35 89.18S248 298.36 248 324"
      fill={fill}
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="40"
    />
    <Circle fill={stroke} cx="248" cy="399.99" r="32" />
  </Svg>
);

const IconComponent = ({ sex }) => {
  return sex === "Mâle" ? (
    <MaleIcon />
  ) : sex === "Femelle" ? (
    <FemaleIcon />
  ) : (
    <QuestionIcon />
  );
};

const FamilyTree = ({ currentAnimalId }) => {
  const navigation = useNavigation();
  const { data: animals } = useSelector((state) => state.animals);

  const buildHierarchy = (animalId) => {
    const animal = animals.find((a) => a.id === animalId);
    const children = animals.filter((a) => a.motherAppId === animalId);
    return {
      ...animal,
      children: children.map((c) => buildHierarchy(c.id)),
    };
  };

  const rootAnimal = animals.find((animal) => !animal.motherAppId);
  if (!rootAnimal) {
    return;
  }

  const root = d3.hierarchy(buildHierarchy(rootAnimal.id), (d) => d.children);
  const treeLayout = d3.tree().nodeSize([200, 130]);
  treeLayout(root);

  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const containerWidth = root.height * 200 + 200;

  const xOffset = screenWidth / 2 + 60;
  const yOffset = 50; // Ajout d'un décalage pour la marge du haut
  root.each((node) => {
    node.x += xOffset;
    node.y += yOffset; // Application du décalage sur l'axe des y
  });

  const nodes = root.descendants();
  const links = root.links();

  return (
    <View style={{ backgroundColor: "#2f2f2f" }}>
      <ScrollView
        horizontal
        directionalLockEnabled={false}
        contentContainerStyle={{
          width: containerWidth,
          height: screenHeight,
          alignItems: "center",
        }}
      >
        <Svg width={containerWidth} height={screenHeight}>
          {links.map((link, index) => (
            <Path
              key={index}
              d={`M ${link.source.x} ${link.source.y} C ${
                (link.source.x + link.target.x) / 2
              } ${link.source.y}, ${(link.source.x + link.target.x) / 2} ${
                link.target.y
              }, ${link.target.x} ${link.target.y}`}
              stroke="#555"
              fill="transparent"
            />
          ))}

          {nodes.map((node, index) => (
            <G key={index}>
              <SvgImage
                x={node.x - 25}
                y={node.y - 25}
                width="50"
                height="50"
                preserveAspectRatio="xMidYMid slice"
                href={{ uri: node.data.image }}
                onPress={() =>
                  navigation.navigate("AnimalDetails", {
                    animalId: node.data.id,
                  })
                }
              />
            </G>
          ))}

          {nodes.map((node, index) => (
            <G
              key={index}
              onPress={() =>
                navigation.navigate("AnimalDetails", { animalId: node.data.id })
              }
            >
              <G x={node.x - 10} y={node.y + 60}>
                <IconComponent sex={node.data.sex} />
              </G>
              <Text
                x={node.x - 20}
                y={node.y + 50}
                fill={node.data.id === currentAnimalId ? "#C40030" : "#FFF"}
                textAnchor="start"
                fontSize={15}
                fontFamily={processFontFamily("WixMadeforDisplay-Regular")}
                fontWeight={600}
              >
                {node.data.name}
              </Text>
            </G>
          ))}
        </Svg>
      </ScrollView>
    </View>
  );
};

export default FamilyTree;
