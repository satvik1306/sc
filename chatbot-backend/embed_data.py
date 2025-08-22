from sentence_transformers import SentenceTransformer
import chromadb

# ✅ New-style Chroma client with persistence
client = chromadb.PersistentClient(path="./chroma-db")
collection = client.get_or_create_collection("villa_data")

model = SentenceTransformer("all-MiniLM-L6-v2")

# Read your website content
with open("villa_info.txt", "r", encoding="utf-8") as f:
    content = f.read()

# Better chunking strategy - split by sections and create meaningful chunks
chunks = []

# Split by major sections first
sections = content.split("COMPANY OVERVIEW")
if len(sections) > 1:
    # Add company overview as first chunk
    chunks.append("COMPANY OVERVIEW\n" + sections[1].split("\n\nFOUNDER INFORMATION")[0])
    
    # Add other sections
    remaining = content.split("FOUNDER INFORMATION")
    if len(remaining) > 1:
        chunks.append("FOUNDER INFORMATION\n" + remaining[1].split("\n\nCOMPANY VISION")[0])
    
    # Add project overview
    project_sections = content.split("LAKEWOODS VILLAS OVERVIEW")
    if len(project_sections) > 1:
        chunks.append("LAKEWOODS VILLAS OVERVIEW\n" + project_sections[1].split("\n\nVILLA SPECIFICATIONS")[0])
    
    # Add contact info
    contact_sections = content.split("CONTACT & SALES")
    if len(contact_sections) > 1:
        chunks.append("CONTACT & SALES\n" + contact_sections[1])

# If section splitting fails, fall back to paragraph splitting
if not chunks:
    chunks = [chunk.strip() for chunk in content.split("\n\n") if chunk.strip()]

print(f"Created {len(chunks)} chunks")

# Add content to Chroma vector DB
for i, chunk in enumerate(chunks):
    embedding = model.encode(chunk).tolist()
    collection.add(
        documents=[chunk],
        embeddings=[embedding],
        ids=[str(i)]
    )

print("✅ All chunks embedded and saved to disk.")
