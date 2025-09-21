import SelectionComponent from '../page-components/selection-page';

export default async function BookSelection() {
  return (
    <main>
      <SelectionComponent books={[{id: 1, title: "test", author: "author1"}]} />
    </main>
  );
}