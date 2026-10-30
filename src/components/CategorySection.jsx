function CategorySection({
  categories,
  showCategoryForm,
  editingCategoryId,
  categoryName,
  setCategoryName,
  categoryColor,
  setCategoryColor,
  categoryError,
  savingCategory,
  onOpenAdd,
  onSubmit,
  onCancel,
  onEdit,
  onDelete,
}) {
  return (
    <section className="categories">
      <h2>Categories</h2>
      <button type="button" onClick={onOpenAdd}>
        Add category
      </button>

      {showCategoryForm && (
        <form className="transaction-form" onSubmit={onSubmit}>
          <h3>
            {editingCategoryId !== null ? "Edit category" : "New category"}
          </h3>
          <label>
            Name
            <input
              type="text"
              required
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              placeholder="e.g. Health"
            />
          </label>
          <label>
            Category color
            <input
              type="color"
              value={categoryColor}
              onChange={(event) => setCategoryColor(event.target.value)}
            />
          </label>
          {categoryError && (
            <p role="alert" className="category-error">
              {categoryError}
            </p>
          )}
          <button type="submit" disabled={savingCategory}>
            {savingCategory
              ? "Saving..."
              : editingCategoryId !== null
                ? "Save changes"
                : "Save category"}
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </form>
      )}

      <div className="category-list">
        {categories.map((category) => (
          <article className="summary-card" key={category.id}>
            <span
              className="category-dot"
              style={{ backgroundColor: category.color }}
            />
            <span>{category.name}</span>
            <button type="button" onClick={() => onEdit(category)}>
              Edit
            </button>
            <button type="button" onClick={() => onDelete(category.id)}>
              Delete
            </button>
          </article>
        ))}
      </div>
      {categoryError && !showCategoryForm && (
        <p role="alert" className="category-error">
          {categoryError}
        </p>
      )}
    </section>
  );
}

export default CategorySection;
