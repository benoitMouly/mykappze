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
  Image as SvgImage,
  Line,
  G,
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

const IconComponent = ({ sex }) => {
  return sex === "Mâle" ? <MaleIcon /> : <FemaleIcon />;
};

const FamilyTree = ({ currentAnimalId }) => {
  const navigation = useNavigation();
  const { data: animals } = useSelector((state) => state.animals);

  const buildHierarchy = (animalId) => {
    const animal = animals.find(a => a.id === animalId);
    const children = animals.filter(a => a.motherAppId === animalId);
    return {
      ...animal,
      children: children.map(c => buildHierarchy(c.id)),
    };
  };

  const rootAnimal = animals.find(animal => !animal.motherAppId);
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
          <Defs>
            {nodes.map((node, index) => (
              <Pattern
                id={`image${index}`}
                patternUnits="userSpaceOnUse"
                x="-25"
                y="-25"
                width="50"
                height="50"
                viewBox="0 0 1 1"
              >
                <SvgImage
                  x="0"
                  y="0"
                  width="1"
                  height="1"
                  preserveAspectRatio="xMidYMid slice"
                  href={{ uri: node.data.image }}
                />
              </Pattern>
            ))}
          </Defs>
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
            <Circle
              key={index}
              cx={node.x}
              cy={node.y}
              r={25}
              fill={`url(#image${index})`}
              onPress={() =>
                navigation.navigate("AnimalDetails", {
                  animalId: node.data.id,
                })
              }
            />
          ))}
{nodes.map((node, index) => (
  <G key={index} onPress={() => navigation.navigate("AnimalDetails", { animalId: node.data.id })}>
    <G x={node.x - 10} y={node.y + 60}>
      <IconComponent sex={node.data.sex} />
    </G>
    <Text
      x={node.x - 20} // Changé ici
      y={node.y + 50} // Changé ici
      fill={node.data.id === currentAnimalId ? "#C40030" : "#FFF"}
      textAnchor="start" // Changé ici
      fontSize={15}
      fontFamily={processFontFamily("WixMadeforDisplay-Regular")}
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
