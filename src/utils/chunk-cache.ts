const CHUNK_SIZE = 512 * 1024; //512KB
const MAX_CACHE_SIZE = 64 * 1024 * 1024; //64MB

export class ChunkCache {
	private chunks = new Map<number, CachedChunk>();
	private pending = new Map<number, Promise<Buffer>>();
	private totalSize = 0;
	private accessCounter = 0;

	async getChunk(index: number, fetcher: () => Promise<Buffer>) {
		const cached = this.chunks.get(index);
		if (cached) {
			cached.lastAccess = ++this.accessCounter;
			return cached.data;
		}

		const existing = this.pending.get(index);
		if (existing) return existing;

		const promise = fetcher()
			.then(data => {
				this.pending.delete(index);
				this.evict(data.length);
				this.chunks.set(index, { data, lastAccess: ++this.accessCounter });
				this.totalSize += data.length;
				return data;
			})
			.catch(err => {
				this.pending.delete(index);
				throw err;
			});

		this.pending.set(index, promise);
		return promise;
	}

	private evict(incoming: number) {
		while (this.totalSize + incoming > MAX_CACHE_SIZE && this.chunks.size > 0) {
			let lruIndex = -1;
			let lruAccess = Infinity;
			for (const [index, chunk] of this.chunks) {
				if (chunk.lastAccess < lruAccess) {
					lruAccess = chunk.lastAccess;
					lruIndex = index;
				}
			}
			if (lruIndex === -1) break;
			this.totalSize -= this.chunks.get(lruIndex)!.data.length;
			this.chunks.delete(lruIndex);
		}
	}

	clear() {
		this.chunks.clear();
		this.pending.clear();
		this.totalSize = 0;
		this.accessCounter = 0;
	}
}

export { CHUNK_SIZE };

interface CachedChunk {
	data: Buffer;
	lastAccess: number;
}
