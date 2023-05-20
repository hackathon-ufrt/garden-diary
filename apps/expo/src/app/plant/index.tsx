import React from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import { api, type RouterOutputs } from "~/utils/api";

const PlantCard: React.FC<{
  plant: RouterOutputs["plant"]["all"][number];
  onDelete: () => void;
}> = ({ plant, onDelete }) => {
  const router = useRouter();

  return (
    <View className="flex flex-row rounded-lg bg-white/10 p-4">
      <View className="flex-grow">
        <TouchableOpacity onPress={() => router.push(`/plant/${plant.id}`)}>
          <Text className="text-xl font-semibold text-pink-400">
            {plant.name}
          </Text>
          <Text className="mt-2 text-white">{plant.description}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onDelete}>
        <Text className="font-bold uppercase text-green-200">Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const CreatePlant: React.FC = () => {
  const utils = api.useContext();

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const { mutate, error } = api.plant.create.useMutation({
    async onSuccess() {
      setName("");
      setDescription("");
      await utils.plant.all.invalidate();
    },
  });

  return (
    <View className="mt-4">
      <TextInput
        className="mb-2 rounded bg-white/10 p-2 text-white"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />
      {error?.data?.zodError?.fieldErrors.title && (
        <Text className="mb-2 text-red-500">
          {error.data.zodError.fieldErrors.title}
        </Text>
      )}
      <TextInput
        className="mb-2 rounded bg-white/10 p-2 text-white"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        value={description}
        onChangeText={setDescription}
        placeholder="Beschreibung"
      />
      {error?.data?.zodError?.fieldErrors.content && (
        <Text className="mb-2 text-red-500">
          {error.data.zodError.fieldErrors.content}
        </Text>
      )}
      <TouchableOpacity
        className="rounded bg-green-900 p-2"
        onPress={() => {
          mutate({
            name,
            description,
          });
        }}
      >
        <Text className="font-semibold text-white">Pflanze Speichern</Text>
      </TouchableOpacity>
    </View>
  );
};

const Index = () => {
  const utils = api.useContext();

  const plantQuery = api.plant.all.useQuery();

  const deletePostMutation = api.post.delete.useMutation({
    onSettled: () => utils.post.all.invalidate(),
  });

  return (
    <SafeAreaView className="bg-green-600">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Pflanzen" }} />
      <View className="h-full w-full p-4">

        <Button
          onPress={() => void utils.plant.all.invalidate()}
          title="Refresh"
          color={"#16302b"}
        />


        <FlashList
          data={plantQuery.data}
          estimatedItemSize={20}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={(p) => (
            <PlantCard
              plant={p.item}
              onDelete={() => deletePostMutation.mutate(p.item.id)}
            />
          )}
        />

        <CreatePlant />
      </View>
    </SafeAreaView>
  );
};

export default Index;
