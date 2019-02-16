<template>
	<div>
		<editor id="tinymce" v-model="tinymceHtml" :init="init"></editor>
		<div v-html='tinymceHtml'></div>
	</div>
</template>

<script>
	import tinymce from 'tinymce/tinymce'
	import 'tinymce/themes/modern/theme'
	import Editor from '@tinymce/tinymce-vue'
	import 'tinymce/plugins/image'
	import 'tinymce/plugins/link'
	import 'tinymce/plugins/code'
	import 'tinymce/plugins/table'
	import 'tinymce/plugins/lists'
	import 'tinymce/plugins/contextmenu'
	import 'tinymce/plugins/wordcount'
	import 'tinymce/plugins/colorpicker'
	import 'tinymce/plugins/textcolor'
	export default {
		data() {
			return {
				tinymceHtml: '???',
				init: {
					language_url: 'tinymce/zh_CN.js',
					language: 'zh_CN',
					skin_url: 'tinymce/skins/lightgray',
					height: 300,
					plugins: 'link lists image code table colorpicker textcolor wordcount',
					toolbar: 'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
					branding: false
				}
			}
		},
		mounted() {
			tinymce.init({});
		},
		components: {
			Editor
		}
	}
</script>

<style>
</style>
