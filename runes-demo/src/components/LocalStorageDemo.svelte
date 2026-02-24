<script lang="ts">
	import { LocalStorageStore, LocalStorageStoreV2, LocalStorageStoreV3 } from '../stores/localStorage.svelte';
	import SettingsUI, { type AppSettings } from './SettingsUI.svelte';

	const defaultSettings: AppSettings = {
		theme: 'light',
		notifications: true,
		volume: 50,
		recentSearches: []
	};

	const settingsV1 = new LocalStorageStore<AppSettings>('app-settings-v1', defaultSettings);
	const settingsV2 = new LocalStorageStoreV2<AppSettings>('app-settings-v2', defaultSettings);
	const settingsV3 = new LocalStorageStoreV3<AppSettings>('app-settings-v3', defaultSettings);
</script>

<div class="demos-container">
	<div class="demo-wrapper">
		<SettingsUI 
			settings={settingsV1} 
			title="V1: Обычный класс"
			description="Использует <code>LocalStorageStore</code>. Эффекты создаются в конструкторе и работают всегда, даже если компонент не отображается."
		/>
	</div>

	<div class="demo-wrapper">
		<SettingsUI 
			settings={settingsV2} 
			title="V2: createSubscriber + untrack"
			description="Использует <code>LocalStorageStoreV2</code>. Демонстрирует использование <code>createSubscriber</code> и <code>untrack()</code> для обхода <code>state_unsafe_mutation</code> при синхронизации стейта."
		/>
	</div>

	<div class="demo-wrapper">
		<SettingsUI 
			settings={settingsV3} 
			title="V3: Proxy + Versioning"
			description="Использует <code>LocalStorageStoreV3</code> (на базе friendofsvelte/state). Использует прокси для трекинга глубоких мутаций."
		/>
	</div>
</div>

<style>
	.demos-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
		gap: 2rem;
		max-width: 1400px;
		margin: 0 auto;
		align-items: stretch;
	}

	.demo-wrapper {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	:global(.demo-container) {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	:global(.demo-container .searches-card) {
		margin-top: auto;
	}
</style>