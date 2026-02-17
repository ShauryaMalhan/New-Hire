import chromadb
from chromadb.config import Settings
import uvicorn

# Configuration for persistence
settings = Settings(
    is_persistent=True,
    persist_directory="./chroma_db",
    anonymized_telemetry=False
)

print(f"🚀 Starting Persistent ChromaDB on 127.0.0.1:8000...")
print(f"📂 Data saved to: ./chroma_db")

# This starts the actual server process
if __name__ == "__main__":
    from chromadb.app import app
    # We pass the settings via environment variables which Chroma reads on boot
    import os
    os.environ["IS_PERSISTENT"] = "True"
    os.environ["PERSIST_DIRECTORY"] = "./chroma_db"
    
    uvicorn.run(app, host="127.0.0.1", port=8000)