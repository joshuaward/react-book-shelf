import React, { Component } from 'react'
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../../hoc/admin_layout';
import { FormElement, BookSchema } from './utils/postsHelper';
import { connect } from 'react-redux';

// WYSIWYG
import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { stateToHTML } from 'draft-js-export-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { editBook, clearBook, getBook } from '../../../../store/actions/book_actions';


class EditPost extends Component {
	state = {
		editorState: '',
		editorContentHtml: '',
		success: false,
		loading: true,bookToEdit: [],
	}

	onEditorStateChange = (editorState) => {
		this.setState({
			editorState
		})
	}

	onEditBook = (values) => {
		this.props.dispatch(editBook(values))
	}

	componentDidUpdate(prevProps) {
		const hasChanged = this.props.books.single !== prevProps.books.single;
		const hasUpdated = this.props.books.update !== prevProps.books.update;
		const single = this.props.books.single;

		if(hasUpdated) {
			this.setState({ success: true })
		}

		if(hasChanged) {
			if(single !== false) {
				const blocksFromHtml = htmlToDraft(single.content);
				const { contentBlocks, entityMap } = blocksFromHtml;
				const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
				this.setState({
					loading: false,
					editorState: EditorState.createWithContent(contentState),
					bookToEdit: {
						_id: single._id,
						name: single.name,
						author: single.author,
						pages: single.pages,
						rating: single.rating,
						price: single.price,
					}
				})
			} else {
				this.props.history.push('/')
			}
		}
	}

	componentWillUnmount() {
		this.props.dispatch(clearBook());
	}

	componentDidMount() {
		// fetch book
		this.props.dispatch(getBook(this.props.match.params.id));
	}

	render() {
		return this.state.loading ?
			<div>Loading</div>

			: 
				<AdminLayout>
					<h4>Edit a Post</h4>
					<Formik
						enableReinitialize={true}
						initialValues={this.state.bookToEdit}
						validationSchema={BookSchema}
						onSubmit={(values, { resetForm }) => {
							this.onEditBook({
								...values,
								content: stateToHTML(this.state.editorState.getCurrentContent())
							})
						}}
					>
						{({
							values,
							errors,
							touched,
							handleChange,
							handleBlur,
							handleSubmit
						}) => (
							<form onSubmit={handleSubmit}>
								<input type="hidden" name="_id" value={values._id} />
								<FormElement 
									elData={{element:'input', type:'text', value:values.name}}
									placeholder="Book Title"
									name="name"
									onHandleChange={(e) => handleChange(e)}
									onHandleBlur={(e) => handleBlur(e)}
									errors={errors.name}
									touched={touched.name}
								/>

								<Editor
									editorState={this.state.editorState}
									onEditorStateChange={this.onEditorStateChange}
									wrapperClassName="demo-wrapper"
									editorClassName="demo-editor"
								/>

								<h4>Book Info</h4>
								<FormElement 
									elData={{element:'input', type:'text', value:values.author}}
									placeholder="Author Name"
									name="author"
									onHandleChange={(e) => handleChange(e)}
									onHandleBlur={(e) => handleBlur(e)}
									errors={errors.author}
									touched={touched.author}
								/>
								<FormElement 
									elData={{element:'input', type:'number', value:values.pages}}
									placeholder="# of Pages"
									name="pages"
									onHandleChange={(e) => handleChange(e)}
									onHandleBlur={(e) => handleBlur(e)}
									errors={errors.pages}
									touched={touched.pages}
								/>
								<FormElement 
									elData={{element:'select', value:values.rating}}
									name="rating"
									onHandleChange={(e) => handleChange(e)}
									onHandleBlur={(e) => handleBlur(e)}
									errors={errors.rating}
									touched={touched.rating}
								>
									<option default>Select a Rating</option>
									<option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4</option>
									<option value="5">5</option>
								</FormElement>
								<FormElement 
									elData={{element:'input', type:'number', value:values.price}}
									placeholder="Book Price"
									name="price"
									onHandleChange={(e) => handleChange(e)}
									onHandleBlur={(e) => handleBlur(e)}
									errors={errors.price}
									touched={touched.price}
								/>

								<button type="submit">
									Edit Book
								</button>
								<br />
								{this.state.success ? 
									<div className="success_entry">
										<div>Your book has been edited!</div>
										<Link to={`/article/${this.props.books.update.doc._id}`}>
											Go to your book
										</Link>
									</div>
								: null}
							</form>
						)}
					</Formik>
				</AdminLayout>
	}
}

function mapStateToProps(state) {
	return {
		books: state.books
	}
}

export default connect(mapStateToProps)(EditPost);