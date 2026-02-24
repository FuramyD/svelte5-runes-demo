<script lang="ts" module>
	export interface AppSettings {
		theme: 'light' | 'dark';
		notifications: boolean;
		volume: number;
		recentSearches: string[];
	}

	export interface SettingsStore {
		value: AppSettings;
	}
</script>

<script lang="ts">
	let {
		settings, 
		title, 
		description 
	}: { 
		settings: SettingsStore, 
		title: string, 
		description: string 
	} = $props();

	let newSearch = $state('');

	function addSearch() {
		if (newSearch.trim()) {
			settings.value.recentSearches.push(newSearch.trim());
			newSearch = '';
		}
	}

	function clearSearches() {
		settings.value.recentSearches = [];
	}
</script>

<div class="demo-container" class:dark={settings.value.theme === 'dark'}>
	<h2>{title}</h2>
	
	<p class="description">
		{@html description}
	</p>

	<div class="settings-card">
		<div class="setting-item">
			<label>
				<span class="label-text">Тема оформления</span>
				<select bind:value={settings.value.theme}>
					<option value="light">Светлая</option>
					<option value="dark">Темная</option>
				</select>
			</label>
		</div>

		<div class="setting-item">
			<label class="checkbox-label">
				<input type="checkbox" bind:checked={settings.value.notifications} />
				<span class="label-text">Включить уведомления</span>
			</label>
		</div>

		<div class="setting-item">
			<label>
				<span class="label-text">Громкость ({settings.value.volume}%)</span>
				<input 
					type="range" 
					min="0" 
					max="100" 
					bind:value={settings.value.volume} 
				/>
			</label>
		</div>
	</div>

	<div class="searches-card">
		<h3>Недавние поиски</h3>
		
		<div class="search-input">
			<input 
				type="text" 
				bind:value={newSearch} 
				placeholder="Введите запрос..."
				onkeydown={(e) => e.key === 'Enter' && addSearch()}
			/>
			<button onclick={addSearch}>Найти</button>
		</div>

		{#if settings.value.recentSearches.length > 0}
			<ul class="search-list">
				{#each settings.value.recentSearches as search}
					<li>{search}</li>
				{/each}
			</ul>
			<button class="clear-btn" onclick={clearSearches}>Очистить историю</button>
		{:else}
			<p class="empty">История пуста</p>
		{/if}
	</div>
</div>

<style>
	.demo-container {
		width: 100%;
		padding: 2rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		color: #333;
		box-sizing: border-box;
	}

	.demo-container.dark {
		background: #212529;
		color: #f8f9fa;
	}

	.demo-container.dark .settings-card,
	.demo-container.dark .searches-card {
		background: #343a40;
		border-color: #495057;
	}

	.demo-container.dark input[type="text"],
	.demo-container.dark select {
		background: #495057;
		color: #f8f9fa;
		border-color: #6c757d;
	}

	.demo-container.dark .search-list li {
		background: #495057;
		border-color: #6c757d;
	}

	.demo-container.dark .description {
		color: #adb5bd;
	}

	h2 {
		margin-top: 0;
	}

	.description {
		color: #666;
		margin-bottom: 2rem;
		line-height: 1.5;
	}

	:global(.description code) {
		background: rgba(128, 128, 128, 0.15);
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-family: monospace;
	}

	.settings-card, .searches-card {
		background: #f8f9fa;
		border: 1px solid #e9ecef;
		border-radius: 6px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.setting-item {
		margin-bottom: 1rem;
	}

	.setting-item:last-child {
		margin-bottom: 0;
	}

	.setting-item label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.setting-item .checkbox-label {
		flex-direction: row;
		align-items: center;
		cursor: pointer;
	}

	.label-text {
		font-weight: 500;
	}

	select, input[type="range"] {
		padding: 0.5rem;
		border-radius: 4px;
		border: 1px solid #ced4da;
		font-size: 1rem;
	}

	input[type="range"] {
		padding: 0;
		cursor: pointer;
	}

	h3 {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.search-input {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.search-input input {
		flex: 1;
		min-width: 0;
		padding: 0.75rem;
		border: 1px solid #ced4da;
		border-radius: 4px;
		font-size: 1rem;
	}

	button {
		padding: 0.75rem 1rem;
		background: #0d6efd;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.2s;
		white-space: nowrap;
	}

	button:hover {
		background: #0b5ed7;
	}

	.clear-btn {
		background: transparent;
		color: #dc3545;
		border: 1px solid #dc3545;
		margin-top: 1rem;
		width: 100%;
	}

	.clear-btn:hover {
		background: #dc3545;
		color: white;
	}

	.search-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.search-list li {
		padding: 0.75rem;
		background: white;
		border: 1px solid #e9ecef;
		border-radius: 4px;
	}

	.empty {
		color: #6c757d;
		font-style: italic;
		text-align: center;
	}
</style>