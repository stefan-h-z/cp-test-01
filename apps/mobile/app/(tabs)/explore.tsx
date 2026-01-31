import { useState } from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Section, Heading, BodyText, Input, Button, Spinner } from '@app/ui';
import { useSections } from '@app/shared';
import type { ContentSection } from '@app/types';

// Demo sections for development
const demoSections: ContentSection[] = [
  {
    id: '1',
    title: 'Featured',
    items: [
      {
        id: 'f1',
        type: 'card',
        title: 'Cross-Platform Development',
        body: 'Build once, deploy everywhere',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: '2',
    title: 'Popular',
    items: [
      {
        id: 'p1',
        type: 'article',
        title: 'React Native Best Practices',
        body: 'Learn the best practices for React Native development',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: '3',
    title: 'Recent',
    items: [
      {
        id: 'r1',
        type: 'article',
        title: 'Getting Started with Tamagui',
        body: 'Universal UI components for React',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, error } = useSections();

  // Use demo sections if API is not available
  const sections = data ?? demoSections;

  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.items.some((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <ScrollView style={{ flex: 1 }}>
      <YStack padding="$4" gap="$6">
        {/* Search */}
        <XStack gap="$2">
          <Input
            flex={1}
            placeholder="Search content..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Button variant="primary">Search</Button>
        </XStack>

        {/* Sections */}
        {isLoading ? (
          <YStack alignItems="center" padding="$6">
            <Spinner size="large" />
          </YStack>
        ) : error ? (
          <BodyText color="$red10">Failed to load sections</BodyText>
        ) : (
          filteredSections.map((section) => (
            <Section key={section.id} gap="$3">
              <Heading level={4}>{section.title}</Heading>
              <YStack gap="$2">
                {section.items.map((item) => (
                  <XStack
                    key={item.id}
                    backgroundColor="$background"
                    padding="$4"
                    borderRadius="$4"
                    borderWidth={1}
                    borderColor="$borderColor"
                    gap="$3"
                    alignItems="center"
                  >
                    <YStack flex={1}>
                      <BodyText fontWeight="600">{item.title}</BodyText>
                      {item.body && (
                        <BodyText muted size="sm" numberOfLines={2}>
                          {item.body}
                        </BodyText>
                      )}
                    </YStack>
                  </XStack>
                ))}
              </YStack>
            </Section>
          ))
        )}

        {filteredSections.length === 0 && (
          <YStack alignItems="center" padding="$6">
            <BodyText muted>No content found</BodyText>
          </YStack>
        )}
      </YStack>
    </ScrollView>
  );
}
